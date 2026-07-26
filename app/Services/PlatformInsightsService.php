<?php

namespace App\Services;

use App\Contracts\Services\PlatformInsightsServiceInterface;
use App\Models\Attempt;
use App\Models\Topic;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class PlatformInsightsService implements PlatformInsightsServiceInterface
{
    public function popularTopics(int $limit = 5): array
    {
        return Cache::remember('popular_topics', 3600, function () use ($limit) {
            return Topic::query()
                ->withCount(['attempts' => fn ($q) => $q->completed()])
                ->orderByDesc('attempts_count')
                ->get(['id', 'name', 'description'])
                ->filter(fn ($t) => $t->attempts_count > 0)
                ->take($limit)
                ->values()
                ->toArray();
        });
    }

    public function scoreDistribution(): array
    {
        return Cache::remember('score_distribution', 3600, function () {
            $buckets = Attempt::completed()
                ->select(DB::raw('
                    CASE
                        WHEN score_percentage < 40 THEN \'0-40\'
                        WHEN score_percentage < 60 THEN \'40-60\'
                        WHEN score_percentage < 80 THEN \'60-80\'
                        ELSE \'80-100\'
                    END as range,
                    COUNT(*) as count
                '))
                ->groupBy('range')
                ->orderBy('range')
                ->pluck('count', 'range');

            $allRanges = ['0-40', '40-60', '60-80', '80-100'];
            $labels = [
                '0-40' => 'أقل من 40%',
                '40-60' => '40% – 60%',
                '60-80' => '60% – 80%',
                '80-100' => '80% – 100%',
            ];

            return collect($allRanges)->map(fn ($range) => [
                'range' => $range,
                'label' => $labels[$range],
                'count' => (int) ($buckets[$range] ?? 0),
            ])->values()->toArray();
        });
    }
}
