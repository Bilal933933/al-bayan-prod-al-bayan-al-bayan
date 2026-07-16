<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCompetitionRequest;
use App\Http\Requests\Admin\SyncCompetitionTopicsRequest;
use App\Http\Requests\Admin\UpdateCompetitionRequest;
use App\Models\Competition;
use App\Models\Topic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Response;

class CompetitionController extends Controller
{
    public function index(Request $request): Response
    {
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');
        $search = $request->query('search', '');
        $filter = $request->query('filter', 'all');

        $allowedSorts = ['name', 'code', 'classification', 'order', 'created_at'];
        $sort = in_array($sort, $allowedSorts) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';

        $query = Competition::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($filter !== 'all') {
            $query->where('classification', $filter);
        }

        $stats = (clone $query)->toBase()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active')
            ->selectRaw("SUM(CASE WHEN classification = 'container' THEN 1 ELSE 0 END) as containers")
            ->selectRaw("SUM(CASE WHEN classification = 'standalone' THEN 1 ELSE 0 END) as standalone")
            ->selectRaw("SUM(CASE WHEN classification = 'child' THEN 1 ELSE 0 END) as children")
            ->first();

        $competitions = $query
            ->with('parent')
            ->withCount('children')
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString();

        return inertia('admin/competitions/index', [
            'competitions' => $competitions,
            'sort' => $sort,
            'direction' => $direction,
            'search' => $search,
            'filter' => $filter,
            'stats' => [
                'total' => (int) ($stats->total ?? 0),
                'active' => (int) ($stats->active ?? 0),
                'containers' => (int) ($stats->containers ?? 0),
                'standalone' => (int) ($stats->standalone ?? 0),
                'children' => (int) ($stats->children ?? 0),
            ],
        ]);
    }

    public function create(Request $request): Response
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

    public function store(StoreCompetitionRequest $request): RedirectResponse
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

    public function show(Competition $competition): Response
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

    public function edit(Competition $competition): Response
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

    public function update(UpdateCompetitionRequest $request, Competition $competition): RedirectResponse
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

    public function destroy(Competition $competition): RedirectResponse
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

    public function editTopics(Competition $competition): Response
    {
        abort_unless($competition->can_have_topics, 403);

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

    public function syncTopics(SyncCompetitionTopicsRequest $request, Competition $competition): RedirectResponse
    {
        $topics = $request->validated('topics', []);
        $syncData = collect((array) $topics)
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
