<?php

namespace App\Observers;

use App\Models\Attempt;
use App\Models\UserScore;
use Illuminate\Support\Facades\Cache;

class AttemptObserver
{
    public function updated(Attempt $attempt): void
    {
        if (! $attempt->isDirty('status') || ! $attempt->isCompleted()) {
            return;
        }

        $points = $attempt->correct_answers * 10;

        UserScore::create([
            'user_id' => $attempt->user_id,
            'attempt_id' => $attempt->id,
            'points' => $points,
            'type' => $attempt->type,
        ]);

        $user = $attempt->user;
        $today = now()->startOfDay();

        if ($user->last_activity_at === null) {
            $user->streak_days = 1;
        } elseif ($user->last_activity_at->equalTo($today->copy()->subDay())) {
            $user->streak_days++;
        } elseif ($user->last_activity_at->lessThan($today->copy()->subDay())) {
            $user->streak_days = 1;
        }

        $user->last_activity_at = $today;
        $user->save();

        Cache::forget('leaderboard_weekly');
        Cache::forget('leaderboard_monthly');
        Cache::forget('leaderboard_all_time');
    }
}
