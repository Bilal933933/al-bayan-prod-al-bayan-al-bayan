<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * @property int $questions_count
 * @property int $duration_minutes
 * @property array<string, int>|null $difficulty_distribution
 */
class CompetitionTopic extends Pivot
{
    protected $table = 'competition_topic';

    protected function casts(): array
    {
        return [
            'difficulty_distribution' => 'array',
        ];
    }
}
