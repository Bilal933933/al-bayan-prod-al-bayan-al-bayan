<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\User;
use App\Models\UserScore;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(): Response
    {
        /** @var User */
        $user = auth()->user();

        $completedAttempts = Attempt::query()
            ->where('user_id', $user->id)
            ->where('status', Attempt::STATUS_COMPLETED);

        $avgScore = (clone $completedAttempts)
            ->whereNotNull('score_percentage')
            ->avg('score_percentage');

        $totalAttempts = Attempt::query()
            ->where('user_id', $user->id)
            ->count();

        $competitionsCount = $user->competitions()->count();

        $avgTimeSeconds = (clone $completedAttempts)
            ->whereNotNull('started_at')
            ->whereNotNull('finished_at')
            ->select(DB::raw('AVG(EXTRACT(EPOCH FROM (finished_at - started_at))) as avg_seconds'))
            ->value('avg_seconds');

        $avgTimeFormatted = $avgTimeSeconds
            ? floor($avgTimeSeconds / 60).':'.str_pad((int) round($avgTimeSeconds % 60), 2, '0', STR_PAD_LEFT)
            : '—';

        $totalPoints = UserScore::query()
            ->where('user_id', $user->id)
            ->sum('points');

        $monthlyScores = (clone $completedAttempts)
            ->where('started_at', '>=', now()->subMonths(6))
            ->select(
                DB::raw("to_char(started_at, 'YYYY-MM') as month"),
                DB::raw('ROUND(AVG(score_percentage)) as percentage')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();

        $monthNames = [
            '01' => 'يناير', '02' => 'فبراير', '03' => 'مارس', '04' => 'أبريل',
            '05' => 'مايو', '06' => 'يونيو', '07' => 'يوليو', '08' => 'أغسطس',
            '09' => 'سبتمبر', '10' => 'أكتوبر', '11' => 'نوفمبر', '12' => 'ديسمبر',
        ];

        $monthlyScores = array_map(function ($item) use ($monthNames) {
            $parts = explode('-', $item['month']);

            return [
                'month' => $monthNames[$parts[1]].' '.$parts[0],
                'percentage' => (int) $item['percentage'],
            ];
        }, $monthlyScores);

        $topicProgressRaw = (clone $completedAttempts)
            ->whereNotNull('topic_id')
            ->select(
                'topic_id',
                DB::raw('COUNT(*) as attempts_count'),
                DB::raw('ROUND(AVG(score_percentage)) as avg_percentage')
            )
            ->groupBy('topic_id')
            ->with('topic:id,name')
            ->get();

        $topicProgress = $topicProgressRaw->map(fn ($a) => [
            'name' => $a->topic?->name ?? '—',
            'percentage' => (int) ($a->avg_percentage ?? 0),
        ])->sortByDesc('percentage')->values()->toArray();

        $streakDays = $user->streak_days ?? 0;

        $badges = $this->resolveBadges($streakDays, $totalAttempts, $avgScore);

        $achievements = $this->resolveAchievements($user);

        return inertia('student/profile', [
            'profileData' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'initial' => mb_substr($user->name, 0, 1),
                ],
                'stats' => [
                    'total_attempts' => $totalAttempts,
                    'avg_score_percentage' => $avgScore ? (int) round((float) $avgScore) : null,
                    'competitions_count' => $competitionsCount,
                    'avg_time_formatted' => $avgTimeFormatted,
                ],
                'streak_days' => $streakDays,
                'total_points' => $totalPoints,
                'monthly_scores' => $monthlyScores,
                'topic_progress' => $topicProgress,
                'badges' => $badges,
                'achievements' => $achievements,
            ],
        ]);
    }

    private function resolveBadges(int $streakDays, int $totalAttempts, mixed $avgScore): array
    {
        $badges = [];

        if ($streakDays >= 7) {
            $badges[] = ['emoji' => '🔥', 'name' => 'المتتالي'];
        }
        if ($totalAttempts >= 20) {
            $badges[] = ['emoji' => '🏆', 'name' => 'المحترف'];
        }
        if ($totalAttempts >= 50) {
            $badges[] = ['emoji' => '⚡', 'name' => 'السريع'];
        }
        if ($totalAttempts >= 100) {
            $badges[] = ['emoji' => '📚', 'name' => 'القارئ'];
        }
        if ($avgScore && $avgScore >= 90) {
            $badges[] = ['emoji' => '🎯', 'name' => 'المثالي'];
        }
        if ($streakDays >= 30) {
            $badges[] = ['emoji' => '💎', 'name' => 'المميز'];
        }
        if ($streakDays >= 100) {
            $badges[] = ['emoji' => '🌟', 'name' => 'النجم'];
        }

        $badges[] = ['emoji' => '🎓', 'name' => 'المتخرج'];

        return $badges;
    }

    private function resolveAchievements(User $user): array
    {
        $achievements = [];

        $bestAttempt = Attempt::query()
            ->where('user_id', $user->id)
            ->where('status', Attempt::STATUS_COMPLETED)
            ->whereNotNull('score_percentage')
            ->orderByDesc('score_percentage')
            ->first();

        if ($bestAttempt) {
            $achievements[] = [
                'icon' => '🎯',
                'iconBg' => '#dbeafe',
                'title' => 'إجابات مثالية',
                'description' => "{$bestAttempt->score_percentage}% إجابات صحيحة",
                'date' => $bestAttempt->finished_at?->format('j F Y') ?? '—',
            ];
        }

        $perfectAttempt = Attempt::query()
            ->where('user_id', $user->id)
            ->where('status', Attempt::STATUS_COMPLETED)
            ->where('score_percentage', 100)
            ->first();

        if ($perfectAttempt) {
            $achievements[] = [
                'icon' => '👑',
                'iconBg' => '#fef3c7',
                'title' => 'المركز الأول',
                'description' => 'درجة كاملة 100%',
                'date' => $perfectAttempt->finished_at?->format('j F Y') ?? '—',
            ];
        }

        $totalQuestions = Attempt::query()
            ->where('user_id', $user->id)
            ->where('status', Attempt::STATUS_COMPLETED)
            ->sum('total_questions');

        if ($totalQuestions >= 100) {
            $achievements[] = [
                'icon' => '📚',
                'iconBg' => '#dcfce7',
                'title' => 'قارئ نشط',
                'description' => "أكثر من {$totalQuestions} سؤال",
                'date' => now()->format('j F Y'),
            ];
        }

        $fastestAttempt = Attempt::query()
            ->where('user_id', $user->id)
            ->where('status', Attempt::STATUS_COMPLETED)
            ->whereNotNull('started_at')
            ->whereNotNull('finished_at')
            ->select(DB::raw('EXTRACT(EPOCH FROM (finished_at - started_at)) / total_questions as time_per_q'))
            ->orderBy('time_per_q')
            ->first();

        if ($fastestAttempt && $fastestAttempt->time_per_q < 5) {
            $achievements[] = [
                'icon' => '⚡',
                'iconBg' => '#f3e8ff',
                'title' => 'أسرع إجابة',
                'description' => 'متوسط '.round((float) $fastestAttempt->time_per_q, 1).' ثانية للسؤال',
                'date' => now()->format('j F Y'),
            ];
        }

        return $achievements;
    }
}
