<?php

namespace App\Services;

use App\Contracts\Services\ExamGradingServiceInterface;
use App\Models\Attempt;
use App\Models\AttemptQuestion;
use App\Models\AttemptSection;
use App\Models\UserScore;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ExamGradingService implements ExamGradingServiceInterface
{
    public function finalizeAttempt(Attempt $attempt): void
    {
        $correctCount = AttemptQuestion::whereHas('section', fn ($q) => $q->where('attempt_id', $attempt->id))
            ->where('is_correct', true)
            ->count();

        $total = $attempt->total_questions;
        $percentage = $total > 0 ? round($correctCount / $total * 100, 2) : 0;

        $attempt->update([
            'status' => Attempt::STATUS_COMPLETED,
            'finished_at' => now(),
            'correct_answers' => $correctCount,
            'score_percentage' => $percentage,
        ]);

        UserScore::create([
            'user_id' => $attempt->user_id,
            'attempt_id' => $attempt->id,
            'points' => $correctCount * 10,
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

    public function handleExpiredSections(Attempt $attempt): void
    {
        DB::transaction(function () use ($attempt) {
            $expiredIds = $attempt->sections()
                ->whereNull('submitted_at')
                ->lockForUpdate()
                ->get()
                ->filter(fn (AttemptSection $section) => $section->isExpired())
                ->pluck('id');

            if ($expiredIds->isEmpty()) {
                return;
            }

            AttemptSection::whereIn('id', $expiredIds)->update(['submitted_at' => now()]);

            $allSubmitted = $attempt->sections()->whereNull('submitted_at')->doesntExist();

            if ($allSubmitted) {
                $this->finalizeAttempt($attempt);
            }
        });
    }
}
