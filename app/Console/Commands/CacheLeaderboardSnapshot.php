<?php

namespace App\Console\Commands;

use App\Models\UserScore;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

#[Signature('app:cache-leaderboard-snapshot')]
#[Description('Cache a weekly snapshot of the top 50 leaderboard ranks for trend comparison')]
class CacheLeaderboardSnapshot extends Command
{
    public function handle(): void
    {
        $topScores = UserScore::select('user_id')
            ->selectRaw('SUM(points) as total')
            ->where('created_at', '>=', now()->subWeek())
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->limit(50)
            ->pluck('total', 'user_id');

        $ranked = [];
        $rank = 1;
        foreach ($topScores as $userId => $total) {
            $ranked[(int) $userId] = $rank++;
        }

        Cache::put('leaderboard_snapshot', $ranked, now()->addWeek());

        $this->info('Leaderboard snapshot cached for '.count($ranked).' users.');
    }
}
