<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

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
