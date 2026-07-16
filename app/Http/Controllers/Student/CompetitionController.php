<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Competition;
use Illuminate\Http\Request;

class CompetitionController extends Controller
{
    public function index(Request $request)
    {
        $classification = $request->query('classification');

        $competitions = Competition::query()
            ->active()
            ->when(
                $classification && in_array($classification, [
                    Competition::CLASSIFICATION_CONTAINER,
                    Competition::CLASSIFICATION_STANDALONE,
                    Competition::CLASSIFICATION_CHILD,
                ]),
                fn ($query) => $query->where('classification', $classification)
            )
            ->when(
                ! $classification,
                fn ($query) => $query->roots()
            )
            ->withCount('children')
            ->orderBy('order')
            ->get();

        return inertia('student/competitions/index', [
            'competitions' => $competitions,
            'filters' => [
                'classification' => $classification,
            ],
        ]);
    }

    public function show(Competition $competition)
    {
        abort_unless($competition->is_active, 404);

        $competition->loadMissing('parent');

        $children = collect();
        $topics = collect();

        if ($competition->isContainer()) {
            $children = $competition->children()
                ->active()
                ->withCount('children')
                ->orderBy('order')
                ->get();
        } else {
            $competition->load(['topics' => fn ($query) => $query->where('topics.is_active', true)]);

            $userId = auth()->id();

            $userAttempts = Attempt::where('user_id', $userId)
                ->where('competition_id', $competition->id)
                ->where('type', Attempt::TYPE_EXAM)
                ->get(['id', 'topic_id', 'status', 'correct_answers', 'total_questions'])
                ->groupBy('topic_id');

            $competition->topics->each(function ($topic) use ($userAttempts) {
                $attempts = $userAttempts->get($topic->id, collect());

                $topic->user_attempts_count = $attempts->count();

                $inProgress = $attempts->firstWhere('status', Attempt::STATUS_IN_PROGRESS);
                $topic->has_in_progress = $inProgress !== null;
                $topic->in_progress_attempt_id = $inProgress?->id;

                $completed = $attempts->where('status', Attempt::STATUS_COMPLETED);
                $best = $completed->sortByDesc('correct_answers')->first();
                $topic->best_score = $best !== null
                    ? ['correct' => (int) $best->correct_answers, 'total' => (int) $best->total_questions]
                    : null;
            });

            $topics = $competition->topics;
            unset($competition->topics);
        }

        return inertia('student/competitions/show', [
            'competition' => $competition,
            'children' => $children,
            'topics' => $topics,
        ]);
    }
}
