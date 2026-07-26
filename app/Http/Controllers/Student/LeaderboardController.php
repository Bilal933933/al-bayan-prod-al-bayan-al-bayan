<?php

namespace App\Http\Controllers\Student;

use App\Contracts\Services\LeaderboardServiceInterface;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserScore;
use Illuminate\Http\Request;
use Inertia\Response;

class LeaderboardController extends Controller
{
    public function __construct(
        private readonly LeaderboardServiceInterface $leaderboardService,
    ) {}

    public function index(Request $request): Response
    {
        $allowed = ['weekly', 'monthly', 'all_time'];
        $period = in_array($request->input('period'), $allowed) ? $request->input('period') : 'weekly';

        $data = $this->leaderboardService->rankings($period);

        $currentUser = null;
        $authUser = $request->user();

        if ($authUser && $authUser instanceof User) {
            $userScore = UserScore::where('user_id', $authUser->id)
                ->when($period !== 'all_time', function ($q) use ($period) {
                    $startDate = $period === 'weekly' ? now()->startOfWeek() : now()->startOfMonth();

                    return $q->where('created_at', '>=', $startDate);
                })
                ->sum('points');

            $allRanked = UserScore::select('user_id')
                ->selectRaw('SUM(points) as total_points')
                ->when($period !== 'all_time', function ($q) use ($period) {
                    $startDate = $period === 'weekly' ? now()->startOfWeek() : now()->startOfMonth();

                    return $q->where('created_at', '>=', $startDate);
                })
                ->groupBy('user_id')
                ->orderByDesc('total_points')
                ->pluck('total_points', 'user_id')
                ->toArray();

            $userRank = 1;
            $userPoints = $userScore;
            foreach ($allRanked as $userId => $points) {
                if ((int) $userId === $authUser->id) {
                    break;
                }
                $userRank++;
            }

            $pointsToNext = 0;
            if ($userRank > 10) {
                $tenthUserId = array_keys($allRanked)[9] ?? null;
                if ($tenthUserId !== null) {
                    $pointsToNext = max(0, $allRanked[$tenthUserId] - $userPoints);
                }
            }

            $currentUser = [
                'rank' => $userRank,
                'points' => (int) $userPoints,
                'points_formatted' => number_format((int) $userPoints),
                'streak_days' => $authUser->streak_days,
                'points_to_next_rank' => $pointsToNext,
                'points_to_next_rank_formatted' => number_format($pointsToNext),
            ];
        }

        return inertia('student/leaderboard', [
            'podium' => $data['podium'],
            'rankings' => $data['rankings'],
            'currentUser' => $currentUser,
            'periods' => [
                ['key' => 'weekly', 'label' => 'هذا الأسبوع'],
                ['key' => 'monthly', 'label' => 'هذا الشهر'],
                ['key' => 'all_time', 'label' => 'كل الأوقات'],
            ],
            'currentPeriod' => $period,
        ]);
    }
}
