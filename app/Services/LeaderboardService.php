<?php

namespace App\Services;

use App\Contracts\Services\LeaderboardServiceInterface;
use App\Models\Competition;
use App\Models\Question;
use App\Models\Topic;
use App\Models\UserScore;
use Illuminate\Support\Facades\Cache;

class LeaderboardService implements LeaderboardServiceInterface
{
    public function rankings(string $period): array
    {
        return Cache::remember("leaderboard_{$period}", 300, function () use ($period) {
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

            return [
                'podium' => $rankings->take(3)->values()->toArray(),
                'rankings' => $rankings->slice(3)->values()->toArray(),
            ];
        });
    }

    public function stats(): array
    {
        return Cache::remember('welcome_stats', 3600, function () {
            return [
                'topics_count' => Topic::active()->count(),
                'questions_count' => Question::active()->count(),
                'competitions_count' => Competition::active()->count(),
            ];
        });
    }
}
