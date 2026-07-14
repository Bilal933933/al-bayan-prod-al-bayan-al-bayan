<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTopicRequest;
use App\Http\Requests\Admin\UpdateTopicRequest;
use App\Models\Topic;

class TopicController extends Controller
{
    public function index()
    {
        $topics = Topic::withCount('competitions')
            ->latest()
            ->paginate(20);

        return inertia('admin/topics/index', [
            'topics' => $topics,
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
