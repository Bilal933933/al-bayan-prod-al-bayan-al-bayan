<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Competition;
use App\Models\Question;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $attemptStats = Attempt::query()
            ->selectRaw("
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress
            ")->first();

        $totalAttempts = (int) ($attemptStats->total ?? 0);
        $completedAttempts = (int) ($attemptStats->completed ?? 0);
        $completionRate = $totalAttempts > 0
            ? round(($completedAttempts / $totalAttempts) * 100)
            : 0;

        $questionStats = Question::query()
            ->selectRaw("
                COUNT(*) as total,
                COUNT(CASE WHEN difficulty = 'easy' THEN 1 END) as easy,
                COUNT(CASE WHEN difficulty = 'medium' THEN 1 END) as medium,
                COUNT(CASE WHEN difficulty = 'hard' THEN 1 END) as hard
            ")->first();

        $studentsCount = User::where('role', User::ROLE_STUDENT)->count();
        $activeStreaks = User::where('role', User::ROLE_STUDENT)
            ->where('streak_days', '>', 0)
            ->count();

        $competitionTotal = Competition::count();
        $containerCount = Competition::where('classification', Competition::CLASSIFICATION_CONTAINER)->count();

        $recentAttempts = Attempt::query()
            ->with([
                'user:id,name,streak_days',
                'competition:id,name,color,icon',
                'topic:id,name',
                'score:attempt_id,points',
            ])
            ->latest()
            ->limit(8)
            ->get();

        $topicPerformance = Topic::query()
            ->select('topics.name')
            ->selectRaw('
                COALESCE(SUM(attempts.total_questions), 0) as total_qs,
                COALESCE(SUM(attempts.correct_answers), 0) as correct_qs
            ')
            ->leftJoin('attempts', 'topics.id', '=', 'attempts.topic_id')
            ->where('attempts.status', 'completed')
            ->groupBy('topics.id', 'topics.name')
            ->havingRaw('SUM(attempts.total_questions) > 0')
            ->get()
            ->map(fn ($topic) => [
                'name' => $topic->name,
                'fail_rate' => $topic->total_qs > 0
                    ? round((($topic->total_qs - $topic->correct_qs) / $topic->total_qs) * 100, 1)
                    : 0,
            ])
            ->values();

        $competitionsMonitor = Competition::query()
            ->select('competitions.name')
            ->selectRaw('COUNT(DISTINCT competition_user.user_id) as students_count')
            ->selectRaw('COUNT(CASE WHEN attempts.status = \'abandoned\' THEN 1 END) as abandoned_attempts')
            ->leftJoin('competition_user', 'competitions.id', '=', 'competition_user.competition_id')
            ->leftJoin('attempts', function ($join) {
                $join->on('competitions.id', '=', 'attempts.competition_id')
                    ->where('attempts.type', 'exam');
            })
            ->where('competitions.is_active', true)
            ->groupBy('competitions.id', 'competitions.name')
            ->havingRaw('COUNT(attempts.id) > 0 OR COUNT(DISTINCT competition_user.user_id) > 0')
            ->get()
            ->values();

        $systemHealthCount = Question::query()
            ->whereDoesntHave('options', fn ($q) => $q->where('is_correct', true))
            ->count();

        return inertia('admin/dashboard/index', [
            'stats' => [
                'students_count' => $studentsCount,
                'active_streaks' => $activeStreaks,
                'attempts' => [
                    'total' => $totalAttempts,
                    'in_progress' => (int) ($attemptStats->in_progress ?? 0),
                    'completion_rate' => $completionRate,
                ],
                'questions' => [
                    'total' => (int) ($questionStats->total ?? 0),
                    'distribution' => [
                        'easy' => (int) ($questionStats->easy ?? 0),
                        'medium' => (int) ($questionStats->medium ?? 0),
                        'hard' => (int) ($questionStats->hard ?? 0),
                    ],
                ],
                'competitions' => [
                    'total' => $competitionTotal,
                    'containers' => $containerCount,
                ],
            ],
            'recentAttempts' => $recentAttempts,
            'topicPerformance' => $topicPerformance,
            'competitionsMonitor' => $competitionsMonitor,
            'systemHealthCount' => $systemHealthCount,
        ]);
    }
}
