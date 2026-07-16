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
        $totalUsers = User::count();
        $totalCompetitions = Competition::count();
        $totalTopics = Topic::count();
        $totalQuestions = Question::count();

        $totalAttempts = Attempt::count();
        $completedAttempts = Attempt::where('status', Attempt::STATUS_COMPLETED)->count();
        $inProgressAttempts = Attempt::where('status', Attempt::STATUS_IN_PROGRESS)->count();

        $recentAttempts = Attempt::with(['user:id,name', 'topic:id,name', 'competition:id,name'])
            ->latest()
            ->limit(10)
            ->get();

        return inertia('admin/dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_competitions' => $totalCompetitions,
                'total_topics' => $totalTopics,
                'total_questions' => $totalQuestions,
                'total_attempts' => $totalAttempts,
                'completed_attempts' => $completedAttempts,
                'in_progress_attempts' => $inProgressAttempts,
            ],
            'recentAttempts' => $recentAttempts,
        ]);
    }
}
