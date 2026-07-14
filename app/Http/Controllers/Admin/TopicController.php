<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTopicRequest;
use App\Http\Requests\Admin\UpdateTopicRequest;
use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');
        $search = $request->query('search', '');
        $filter = $request->query('filter', 'all');

        $allowedSorts = ['name', 'code', 'visibility', 'default_questions_count', 'default_duration_minutes', 'created_at'];
        $sort = in_array($sort, $allowedSorts) ? $sort : 'created_at';
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'desc';

        $query = Topic::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($filter !== 'all') {
            $query->where('visibility', $filter);
        }

        $stats = (clone $query)
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active')
            ->selectRaw("SUM(CASE WHEN visibility = 'general' THEN 1 ELSE 0 END) as general")
            ->selectRaw("SUM(CASE WHEN visibility = 'private' THEN 1 ELSE 0 END) as private_")
            ->first();

        $topics = $query
            ->withCount('competitions')
            ->orderBy($sort, $direction)
            ->paginate(20)
            ->withQueryString();

        return inertia('admin/topics/index', [
            'topics' => $topics,
            'sort' => $sort,
            'direction' => $direction,
            'search' => $search,
            'filter' => $filter,
            'stats' => [
                'total' => (int) $stats->total,
                'active' => (int) $stats->active,
                'general' => (int) $stats->general,
                'private_' => (int) $stats->private_,
            ],
        ]);
    }

    public function show(Topic $topic)
    {
        $topic->load('competitions');

        return inertia('admin/topics/show', [
            'topic' => $topic,
        ]);
    }

    public function create()
    {
        return inertia('admin/topics/create');
    }

    public function store(StoreTopicRequest $request)
    {
        Topic::create($request->validated());

        return redirect()
            ->route('admin.topics.index')
            ->with('success', 'تم إنشاء المحور بنجاح.');
    }

    public function edit(Topic $topic)
    {
        return inertia('admin/topics/edit', [
            'topic' => $topic,
        ]);
    }

    public function update(UpdateTopicRequest $request, Topic $topic)
    {
        $topic->update($request->validated());

        return redirect()
            ->route('admin.topics.index')
            ->with('success', 'تم تحديث المحور بنجاح.');
    }

    public function destroy(Topic $topic)
    {
        if ($topic->competitions()->exists()) {
            return back()->with('error', 'لا يمكن حذف محور مرتبط بمسابقات.');
        }

        $topic->delete();

        return redirect()
            ->route('admin.topics.index')
            ->with('success', 'تم حذف المحور بنجاح.');
    }
}
