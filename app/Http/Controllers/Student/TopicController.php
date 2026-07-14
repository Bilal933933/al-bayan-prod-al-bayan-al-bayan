<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Topic;

class TopicController extends Controller
{
    public function index()
    {
        $topics = Topic::active()
            ->get([
                'id', 'code', 'name', 'visibility', 'description',
                'default_questions_count', 'default_duration_minutes',
            ]);

        return inertia('student/topics/index', compact('topics'));
    }

    public function show(Topic $topic)
    {
        abort_unless($topic->is_active, 404);

        return inertia('student/topics/show', compact('topic'));
    }
}
