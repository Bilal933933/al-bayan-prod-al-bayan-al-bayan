<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Competition;
use App\Models\Topic;
use Illuminate\Http\Request;
use Inertia\Response;

class AttemptController extends Controller
{
    private const PAGINATION = 20;

    public function index(Request $request): Response
    {
        $search = $request->query('search', '');
        $type = $request->query('type');
        $status = $request->query('status');
        $topicId = $request->query('topic_id');
        $competitionId = $request->query('competition_id');

        $query = Attempt::query()
            ->with(['user:id,name,email', 'topic:id,name', 'competition:id,name'])
            ->withCount('sections');

        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($type && in_array($type, ['practice', 'exam'])) {
            $query->where('type', $type);
        }

        if ($status && in_array($status, ['in_progress', 'completed', 'abandoned'])) {
            $query->where('status', $status);
        }

        if ($topicId) {
            $query->where('topic_id', $topicId);
        }

        if ($competitionId) {
            $query->where('competition_id', $competitionId);
        }

        $attempts = $query
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        $topics = Topic::active()->get(['id', 'name']);
        $competitions = Competition::query()->get(['id', 'name']);

        return inertia('admin/attempts/index', [
            'attempts' => $attempts,
            'filters' => [
                'search' => $search,
                'type' => $type,
                'status' => $status,
                'topic_id' => $topicId,
                'competition_id' => $competitionId,
            ],
            'topics' => $topics,
            'competitions' => $competitions,
        ]);
    }

    public function show(Attempt $attempt): Response
    {
        $attempt->load([
            'user:id,name,email',
            'sections.topic:id,name',
            'sections.questions.question.options',
            'topic:id,name',
            'competition:id,name',
        ]);

        return inertia('admin/attempts/show', [
            'attempt' => $attempt,
        ]);
    }
}
