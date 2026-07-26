<?php

namespace App\Contracts\Services;

interface LeaderboardServiceInterface
{
    public function rankings(string $period): array;

    public function stats(): array;
}
