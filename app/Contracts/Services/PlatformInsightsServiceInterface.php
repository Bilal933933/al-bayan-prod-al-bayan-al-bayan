<?php

namespace App\Contracts\Services;

interface PlatformInsightsServiceInterface
{
    public function popularTopics(int $limit = 5): array;

    public function scoreDistribution(): array;
}
