<?php

namespace Database\Seeders;

use App\Models\Attempt;
use App\Models\User;
use App\Models\UserScore;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class BackfillUserScoresSeeder extends Seeder
{
    public function run(): void
    {
        $completedAttempts = Attempt::where('status', Attempt::STATUS_COMPLETED)
            ->with('user')
            ->get();

        if ($completedAttempts->isEmpty()) {
            $this->command->info('لا توجد محاولات مكتملة.');

            return;
        }

        $userDates = [];

        foreach ($completedAttempts as $attempt) {
            UserScore::create([
                'user_id' => $attempt->user_id,
                'attempt_id' => $attempt->id,
                'points' => $attempt->correct_answers * 10,
                'type' => $attempt->type,
            ]);

            if ($attempt->finished_at) {
                $date = $attempt->finished_at->copy()->startOfDay();
                $userId = $attempt->user_id;
                $userDates[$userId][] = $date;
            }
        }

        foreach ($userDates as $userId => $dates) {
            $user = User::find($userId);
            if (! $user) {
                continue;
            }

            $dates = collect($dates)->map(fn ($d) => $d->format('Y-m-d'))->unique()->sort()->values();

            $streakDays = 0;
            $lastDate = null;

            foreach ($dates as $dateStr) {
                $current = Carbon::parse($dateStr);
                if ($lastDate === null) {
                    $streakDays = 1;
                } elseif ($lastDate->diffInDays($current) == 1) {
                    $streakDays++;
                } elseif ($lastDate->diffInDays($current) > 1) {
                    $streakDays = 1;
                }
                $lastDate = $current;
            }

            $user->streak_days = $streakDays;
            $user->last_activity_at = $lastDate;
            $user->save();
        }

        Cache::forget('leaderboard_weekly');
        Cache::forget('leaderboard_monthly');
        Cache::forget('leaderboard_all_time');
        Cache::forget('leaderboard_snapshot');

        $count = $completedAttempts->count();
        $this->command->info("تم إنشاء {$count} سجل نقاط من المحاولات المكتملة.");
    }
}
