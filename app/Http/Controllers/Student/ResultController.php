<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Response;

class ResultController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = auth()->id();

        $allAttempts = Attempt::where('user_id', $userId);
        $completed = (clone $allAttempts)->where('status', Attempt::STATUS_COMPLETED)
            ->with(['topic:id,name', 'competition:id,name'])
            ->get();

        $totalAttempts = (clone $allAttempts)->count();
        $completedCount = $completed->count();
        $inProgressCount = (clone $allAttempts)->where('status', Attempt::STATUS_IN_PROGRESS)->count();

        $totalCorrect = $completed->sum('correct_answers');
        $totalQuestions = $completed->sum('total_questions');
        $averagePercentage = $totalQuestions > 0 ? (int) round($totalCorrect / $totalQuestions * 100) : null;

        $bestScore = $completed->max('correct_answers') ?? 0;

        $totalSeconds = $completed->reduce(function ($carry, $attempt) {
            if ($attempt->started_at && $attempt->finished_at) {
                return $carry + $attempt->started_at->diffInSeconds($attempt->finished_at);
            }

            return $carry;
        }, 0);

        $recentResults = $completed->sortByDesc('created_at')->take(10)->map(fn ($a) => [
            'id' => $a->id,
            'type' => $a->type,
            'subject_name' => $a->subject_name,
            'correct_answers' => $a->correct_answers,
            'total_questions' => $a->total_questions,
            'percentage' => $a->total_questions > 0 ? round($a->correct_answers / $a->total_questions * 100) : 0,
            'created_at' => $a->created_at,
        ]);

        $progress = $completed->sortBy('created_at')->values()->map(fn ($a) => [
            'date' => $a->created_at,
            'percentage' => $a->total_questions > 0 ? round($a->correct_answers / $a->total_questions * 100) : 0,
            'type' => $a->type,
        ]);

        return inertia('student/results/index', [
            'overallStats' => [
                'total_attempts' => $totalAttempts,
                'completed_count' => $completedCount,
                'in_progress_count' => $inProgressCount,
                'average_percentage' => $averagePercentage,
                'best_score' => $bestScore,
                'total_seconds' => $totalSeconds,
            ],
            'evaluation' => $this->evaluate($averagePercentage),
            'topicBreakdown' => $this->getTopicBreakdown($completed),
            'competitionBreakdown' => $this->getCompetitionBreakdown($completed),
            'recentResults' => $recentResults,
            'progress' => $progress,
        ]);
    }

    /** @return array{level: string, label: string, color: string} */
    private function evaluate(?int $averagePercentage): array
    {
        if ($averagePercentage === null) {
            return ['level' => 'no_data', 'label' => 'لا توجد نتائج', 'color' => 'gray'];
        }

        return match (true) {
            $averagePercentage >= 90 => ['level' => 'excellent', 'label' => 'ممتاز', 'color' => 'emerald'],
            $averagePercentage >= 75 => ['level' => 'very_good', 'label' => 'جيد جداً', 'color' => 'blue'],
            $averagePercentage >= 60 => ['level' => 'good', 'label' => 'جيد', 'color' => 'amber'],
            $averagePercentage >= 45 => ['level' => 'passable', 'label' => 'مقبول', 'color' => 'orange'],
            default => ['level' => 'weak', 'label' => 'ضعيف', 'color' => 'red'],
        };
    }

    /** @param EloquentCollection<int, Attempt> $completed
     * @return Collection<int, mixed> */
    private function getTopicBreakdown(EloquentCollection $completed): Collection
    {
        return $completed->filter(fn ($a) => $a->topic_id !== null)->groupBy('topic_id')
            ->map(function ($group) {
                $totalCorrect = $group->sum('correct_answers');
                $totalQuestions = $group->sum('total_questions');
                $avg = $totalQuestions > 0 ? round($totalCorrect / $totalQuestions * 100) : 0;
                $topic = $group->first()->topic;

                $status = match (true) {
                    $avg >= 75 => 'strength',
                    $avg >= 50 => 'average',
                    default => 'weakness',
                };

                return [
                    'topic_id' => $topic?->id,
                    'topic_name' => $topic->name ?? '—',
                    'attempts_count' => $group->count(),
                    'average_percentage' => $avg,
                    'best_score' => $group->max('correct_answers') ?? 0,
                    'status' => $status,
                ];
            })
            ->values();
    }

    /** @param EloquentCollection<int, Attempt> $completed
     * @return Collection<int, mixed> */
    private function getCompetitionBreakdown(EloquentCollection $completed): Collection
    {
        return $completed->where('type', Attempt::TYPE_EXAM)
            ->groupBy('competition_id')
            ->map(function ($group) {
                $totalCorrect = $group->sum('correct_answers');
                $totalQuestions = $group->sum('total_questions');
                $competition = $group->first()->competition;

                return [
                    'competition_id' => $competition?->id,
                    'competition_name' => $competition->name ?? '—',
                    'attempts_count' => $group->count(),
                    'average_percentage' => $totalQuestions > 0 ? round($totalCorrect / $totalQuestions * 100) : 0,
                    'best_score' => $group->max('correct_answers') ?? 0,
                ];
            })
            ->values();
    }
}
