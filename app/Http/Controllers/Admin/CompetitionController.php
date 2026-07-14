<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCompetitionRequest;
use App\Http\Requests\Admin\SyncCompetitionTopicsRequest;
use App\Http\Requests\Admin\UpdateCompetitionRequest;
use App\Models\Competition;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CompetitionController extends Controller
{
    public function index()
    {
        $competitions = Competition::with('parent')
            ->withCount('children')
            ->latest()
            ->paginate(10);

        return inertia('admin/competitions/index', [
            'competitions' => $competitions,
        ]);
    }

    public function create(Request $request)
    {
        $availableParents = Competition::where('classification', Competition::CLASSIFICATION_CONTAINER)
            ->active()
            ->orderBy('order')
            ->get(['id', 'name']);

        $parentId = $request->query('parent_id');
        $defaultParentId = $parentId && Competition::where('id', $parentId)->where('classification', Competition::CLASSIFICATION_CONTAINER)->exists()
            ? (int) $parentId
            : null;

        return inertia('admin/competitions/create', [
            'availableParents' => $availableParents,
            'defaultParentId' => $defaultParentId,
        ]);
    }

    public function store(StoreCompetitionRequest $request)
    {
        $validated = $request->validated();
        $validated['order'] = Competition::where('parent_id', $request->parent_id)->max('order') + 1;
        $validated['slug'] = Str::slug($request->name) ?: $request->code;

        if ($request->hasFile('image_file')) {
            $validated['image'] = $request->file('image_file')->store('competitions', 'public');
        }

        unset($validated['image_file']);

        Competition::create($validated);

        return redirect()
            ->route('admin.competitions.index')
            ->with('success', 'تم إنشاء المسابقة بنجاح.');
    }

    public function show(Competition $competition)
    {
        $competition->load([
            'parent',
            'children' => function ($query) {
                $query->orderBy('order')->withCount('children');
            },
        ]);

        $childrenCount = $competition->children->count();

        return inertia('admin/competitions/show', [
            'competition' => $competition,
            'childrenCount' => $childrenCount,
        ]);
    }

    public function edit(Competition $competition)
    {
        $availableParents = Competition::where('classification', Competition::CLASSIFICATION_CONTAINER)
            ->active()
            ->where('id', '!=', $competition->id)
            ->orderBy('order')
            ->get(['id', 'name']);

        return inertia('admin/competitions/edit', [
            'competition' => $competition,
            'availableParents' => $availableParents,
        ]);
    }

    public function update(UpdateCompetitionRequest $request, Competition $competition)
    {
        $validated = $request->validated();

        if ($request->hasFile('image_file')) {
            if ($competition->image) {
                Storage::disk('public')->delete($competition->image);
            }

            $validated['image'] = $request->file('image_file')->store('competitions', 'public');
        } elseif (array_key_exists('image', $validated) && $validated['image'] === null && $competition->image) {
            Storage::disk('public')->delete($competition->image);
        }

        unset($validated['image_file']);

        $competition->update($validated);

        return redirect()
            ->route('admin.competitions.index')
            ->with('success', 'تم تحديث المسابقة بنجاح.');
    }

    public function destroy(Competition $competition)
    {
        if ($competition->children()->exists()) {
            return back()->with('error', 'لا يمكن حذف مسابقة لها مسابقات فرعية مرتبطة بها.');
        }

        if ($competition->image) {
            Storage::disk('public')->delete($competition->image);
        }

        $competition->delete();

        return redirect()
            ->route('admin.competitions.index')
            ->with('success', 'تم حذف المسابقة بنجاح.');
    }

    public function editTopics(Competition $competition)
    {
        abort_unless($competition->canHaveTopics(), 403);

        $attachedTopics = $competition->topics()->get();

        $availableTopics = Topic::active()
            ->whereNotIn('id', $attachedTopics->pluck('id'))
            ->get(['id', 'name', 'visibility', 'default_questions_count', 'default_duration_minutes']);

        return inertia('admin/competitions/topics', [
            'competition' => $competition,
            'attachedTopics' => $attachedTopics,
            'availableTopics' => $availableTopics,
        ]);
    }

    public function syncTopics(SyncCompetitionTopicsRequest $request, Competition $competition)
    {
        $syncData = collect($request->validated('topics'))
            ->mapWithKeys(fn ($item) => [
                $item['topic_id'] => [
                    'questions_count' => $item['questions_count'],
                    'duration_minutes' => $item['duration_minutes'],
                    'difficulty_distribution' => $item['difficulty_distribution'] ?? null,
                ],
            ])
            ->toArray();

        $competition->topics()->sync($syncData);

        return back()->with('success', 'تم تحديث محاور المسابقة بنجاح.');
    }
}
