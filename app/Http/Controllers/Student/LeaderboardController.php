<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserScore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Response;

class LeaderboardController extends Controller
{
    public function index(Request $request): Response
    {
        $period = $request->input('period', 'weekly');

        $data = Cache::remember("leaderboard_{$period}", 300, function () use ($period) {
            $startDate = match ($period) {
                'weekly' => now()->startOfWeek(),
                'monthly' => now()->startOfMonth(),
                default => null,
            };

            $query = UserScore::select('user_id')
                ->selectRaw('SUM(points) as total_points')
                ->with('user');

            if ($startDate) {
                $query->where('created_at', '>=', $startDate);
            }

            $ranked = $query->groupBy('user_id')
                ->orderByDesc('total_points')
                ->limit(100)
                ->get();

            $snapshot = Cache::get('leaderboard_snapshot', []);

            $rankings = $ranked->map(function ($entry, $index) use ($snapshot) {
                $rank = $index + 1;
                $previousRank = $snapshot[$entry->user_id] ?? null;
                $trend = null;
                $trendValue = 0;

                if ($previousRank !== null) {
                    $diff = $previousRank - $rank;
                    if ($diff > 0) {
                        $trend = 'up';
                        $trendValue = $diff;
                    } elseif ($diff < 0) {
                        $trend = 'down';
                        $trendValue = abs($diff);
                    } else {
                        $trend = 'same';
                    }
                }

                $user = $entry->user;
                $points = (int) $entry->total_points;

                return [
                    'rank' => $rank,
                    'user' => $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                        'avatar' => $user->avatar ?? null,
                    ] : null,
                    'points' => $points,
                    'points_formatted' => number_format($points),
                    'streak_days' => $user->streak_days ?? 0,
                    'trend' => $trend,
                    'trend_value' => $trendValue,
                ];
            });

            $podium = $rankings->take(3)->values()->toArray();
            $rest = $rankings->slice(3)->values()->toArray();

            return [
                'podium' => $podium,
                'rankings' => $rest,
            ];
        });

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
