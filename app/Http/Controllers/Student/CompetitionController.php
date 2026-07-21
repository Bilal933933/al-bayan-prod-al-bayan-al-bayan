<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Competition;
use Illuminate\Http\Request;
use Inertia\Response;

class CompetitionController extends Controller
{
    public function index(Request $request): Response
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
            ->withCount(['children', 'users', 'topics'])
            ->orderBy('order')
            ->get();

        $myCompetitions = auth()->user()->competitions()
            ->active()
            ->withPivot('joined_at')
            ->withCount(['topics', 'users'])
            ->withCount(['attempts as user_attempts_count' => fn ($q) => $q->where('user_id', auth()->id())])
            ->withMax(['attempts as last_attempt_at' => fn ($q) => $q->where('user_id', auth()->id())], 'created_at')
            ->get();

        return inertia('student/competitions/index', [
            'competitions' => $competitions,
            'myCompetitions' => $myCompetitions,
            'filters' => [
                'classification' => $classification,
            ],
        ]);
    }

    public function show(Competition $competition): Response
    {
        abort_unless($competition->is_active, 404);

        $competition->loadMissing('parent');

        $children = collect();
        $topics = collect();
        $totalQuestions = 0;
        $totalMinutes = 0;

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

            $totalQuestions = $topics->sum(fn ($t) => $t->pivot->questions_count);
            $totalMinutes = $topics->sum(fn ($t) => $t->pivot->duration_minutes);
        }

        $isJoined = auth()->user()->competitions()
            ->where('competition_id', $competition->getRootId())
            ->exists();

        return inertia('student/competitions/show', [
            'competition' => $competition,
            'children' => $children,
            'topics' => $topics,
            'is_joined' => $isJoined,
            'total_questions' => $totalQuestions,
            'total_minutes' => $totalMinutes,
        ]);
    }
}
