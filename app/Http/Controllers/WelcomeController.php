<?php

namespace App\Http\Controllers;

use App\Contracts\Services\LeaderboardServiceInterface;
use App\Contracts\Services\PlatformInsightsServiceInterface;
use Inertia\Response;

class WelcomeController extends Controller
{
    private const DEMO_PODIUM = [
        [
            'rank' => 1,
            'user' => ['id' => 0, 'name' => 'متدرب أول', 'avatar' => null],
            'points' => 850,
            'points_formatted' => '850',
            'streak_days' => 12,
            'trend' => 'up',
            'trend_value' => 2,
        ],
        [
            'rank' => 2,
            'user' => ['id' => 0, 'name' => 'متدرب ثانٍ', 'avatar' => null],
            'points' => 720,
            'points_formatted' => '720',
            'streak_days' => 8,
            'trend' => 'same',
            'trend_value' => 0,
        ],
        [
            'rank' => 3,
            'user' => ['id' => 0, 'name' => 'متدرب ثالث', 'avatar' => null],
            'points' => 640,
            'points_formatted' => '640',
            'streak_days' => 5,
            'trend' => 'down',
            'trend_value' => 1,
        ],
    ];

    private const DEMO_TOPICS = [
        ['id' => 0, 'name' => 'التفسير', 'description' => 'تفسير القرآن الكريم وأسباب النزول', 'attempts_count' => 42],
        ['id' => 0, 'name' => 'العقيدة', 'description' => 'أصول الإيمان والتوحيد', 'attempts_count' => 38],
        ['id' => 0, 'name' => 'الفقه', 'description' => 'أحكام العبادات والمعاملات', 'attempts_count' => 31],
        ['id' => 0, 'name' => 'الحديث', 'description' => 'مصطلح الحديث والمتون', 'attempts_count' => 27],
        ['id' => 0, 'name' => 'النحو', 'description' => 'قواعد النحو والإعراب', 'attempts_count' => 22],
    ];

    private const DEMO_DISTRIBUTION = [
        ['range' => '0-40', 'label' => 'أقل من 40%', 'count' => 5],
        ['range' => '40-60', 'label' => '40% – 60%', 'count' => 12],
        ['range' => '60-80', 'label' => '60% – 80%', 'count' => 18],
        ['range' => '80-100', 'label' => '80% – 100%', 'count' => 10],
    ];

    public function __construct(
        private readonly LeaderboardServiceInterface $leaderboardService,
        private readonly PlatformInsightsServiceInterface $insightsService,
    ) {}

    public function index(): Response
    {
        $stats = $this->leaderboardService->stats();
        $podium = $this->leaderboardService->rankings('all_time')['podium'];
        $popularTopics = $this->insightsService->popularTopics();
        $scoreDistribution = $this->insightsService->scoreDistribution();

        $hasActivity = $podium !== [] || $popularTopics !== [];

        return inertia('welcome', [
            'stats' => $stats,
            'podium' => $hasActivity ? $podium : self::DEMO_PODIUM,
            'popularTopics' => $hasActivity ? $popularTopics : self::DEMO_TOPICS,
            'scoreDistribution' => $hasActivity ? $scoreDistribution : self::DEMO_DISTRIBUTION,
            'isPreview' => ! $hasActivity,
        ]);
    }
}
