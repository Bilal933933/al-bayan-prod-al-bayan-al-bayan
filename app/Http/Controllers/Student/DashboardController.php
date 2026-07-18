<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Competition;
use App\Models\Topic;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = auth()->id();

        // In-progress attempt to continue
        $inProgressAttempt = Attempt::where('user_id', $userId)
            ->where('status', Attempt::STATUS_IN_PROGRESS)
            ->with(['topic:id,name', 'competition:id,name', 'sections' => fn ($q) => $q->select(['id', 'attempt_id', 'order', 'questions_count'])->orderBy('order')])
            ->latest()
            ->first();

        // Recent completed attempts
        $recentAttempts = Attempt::where('user_id', $userId)
            ->where('status', Attempt::STATUS_COMPLETED)
            ->with(['topic:id,name', 'competition:id,name'])
            ->latest('finished_at')
            ->limit(5)
            ->get();

        // Overall stats
        $allAttempts = Attempt::where('user_id', $userId);
        $completedAttempts = (clone $allAttempts)->where('status', Attempt::STATUS_COMPLETED);
        $totalCompleted = $completedAttempts->count();

        $averagePercentage = $totalCompleted > 0
            ? round($completedAttempts->sum('correct_answers') / max($completedAttempts->sum('total_questions'), 1) * 100)
            : null;

        // Upcoming/active competitions
        $activeCompetitions = Competition::where('is_active', true)
            ->withCount('topics')
            ->latest()
            ->limit(3)
            ->get();

        // Recommended topics (not attempted yet or low score)
        $attemptedTopicIds = Attempt::where('user_id', $userId)->pluck('topic_id')->unique()->filter();
        $recommendedTopics = Topic::where('is_active', true)
            ->where('visibility', 'general')
            ->whereNotIn('id', $attemptedTopicIds)
            ->whereHas('questions')
            ->inRandomOrder()
            ->limit(3)
            ->get();

        // Recent competitions the user participated in
        $userCompetitionIds = Attempt::where('user_id', $userId)
            ->whereNotNull('competition_id')
            ->distinct('competition_id')
            ->pluck('competition_id');

        $recentCompetitions = Competition::whereIn('id', $userCompetitionIds)
            ->withCount('topics')
            ->latest()
            ->limit(3)
            ->get();

        // Upcoming competitions the user joined
        $upcomingCompetitions = auth()->user()->competitions()
            ->active()
            ->upcoming()
            ->withCount('topics')
            ->orderBy('start_date')
            ->limit(3)
            ->get();

        if ($upcomingCompetitions->isEmpty()) {
            $upcomingCompetitions = Competition::active()
                ->upcoming()
                ->withCount('topics')
                ->orderBy('start_date')
                ->limit(3)
                ->get();
        }

        $userModel = auth()->user();

        return inertia('student/dashboard', [
            'user' => [
                'name' => $userModel->name,
                'email' => $userModel->email,
            ],
            'inProgressAttempt' => $inProgressAttempt,
            'recentAttempts' => $recentAttempts,
            'stats' => [
                'total_attempts' => $allAttempts->count(),
                'completed_attempts' => $totalCompleted,
                'in_progress_attempts' => (clone $allAttempts)->where('status', Attempt::STATUS_IN_PROGRESS)->count(),
                'average_percentage' => $averagePercentage,
                'streak_days' => $userModel->streak_days ?? 0,
            ],
            'activeCompetitions' => $activeCompetitions,
            'recommendedTopics' => $recommendedTopics,
            'recentCompetitions' => $recentCompetitions,
            'upcomingCompetitions' => $upcomingCompetitions,
            'lastActivityAt' => $userModel->last_activity_at,
        ]);
    }
}
