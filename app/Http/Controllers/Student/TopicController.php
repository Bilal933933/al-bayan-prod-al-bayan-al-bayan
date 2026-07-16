<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Topic;
use Inertia\Response;

class TopicController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();

        $topics = Topic::active()
            ->get([
                'id', 'code', 'name', 'visibility', 'description',
                'default_questions_count', 'default_duration_minutes',
            ]);

        $allAttempts = Attempt::where('user_id', $userId)
            ->whereIn('topic_id', $topics->pluck('id'))
            ->where('type', Attempt::TYPE_PRACTICE)
            ->get(['id', 'topic_id', 'status', 'correct_answers', 'total_questions'])
            ->groupBy('topic_id');

        $topics->each(function ($topic) use ($allAttempts) {
            $attempts = $allAttempts->get($topic->id, collect());

            $topic->user_attempts_count = $attempts->count();

            $inProgress = $attempts->firstWhere('status', Attempt::STATUS_IN_PROGRESS);
            $topic->has_in_progress = $inProgress !== null;
            $topic->in_progress_attempt_id = $inProgress?->id;

            $completed = $attempts->where('status', Attempt::STATUS_COMPLETED);
            $best = $completed->sortByDesc('correct_answers')->first();
            $topic->best_score = $best !== null
                ? ['correct' => $best->correct_answers, 'total' => $best->total_questions]
                : null;
        });

        return inertia('student/topics/index', compact('topics'));
    }

    public function show(Topic $topic): Response
    {
        abort_unless($topic->is_active, 404);

        $userId = auth()->id();

        $attempts = Attempt::where('user_id', $userId)
            ->where('topic_id', $topic->id)
            ->where('type', Attempt::TYPE_PRACTICE)
            ->latest()
            ->get(['id', 'status', 'correct_answers', 'total_questions', 'created_at', 'finished_at']);

        $userStats = [
            'total_attempts' => $attempts->count(),
            'last_practice_at' => $attempts->first()?->created_at,
            'best_score' => $attempts
                ->where('status', Attempt::STATUS_COMPLETED)
                ->sortByDesc('correct_answers')
                ->first()
                ?->only(['correct_answers', 'total_questions']),
            'average_percentage' => (function () use ($attempts) {
                $completed = $attempts->where('status', Attempt::STATUS_COMPLETED);
                if ($completed->isEmpty()) {
                    return null;
                }

                return round(
                    $completed->sum('correct_answers') / max($completed->sum('total_questions'), 1) * 100,
                );
            })(),
        ];

        $inProgress = $attempts->firstWhere('status', Attempt::STATUS_IN_PROGRESS);

        $recentAttempts = $attempts
            ->take(5)
            ->map(fn ($a) => [
                'id' => $a->id,
                'status' => $a->status,
                'correct_answers' => $a->correct_answers,
                'total_questions' => $a->total_questions,
                'created_at' => $a->created_at,
            ]);

        return inertia('student/topics/show', [
            'topic' => $topic,
            'userStats' => $userStats,
            'hasInProgress' => $inProgress !== null,
            'inProgressAttemptId' => $inProgress?->id,
            'recentAttempts' => $recentAttempts,
        ]);
    }
}
