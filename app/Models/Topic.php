<?php

namespace App\Models;

use Database\Factories\TopicFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Topic extends Model
{
    /** @use HasFactory<TopicFactory> */
    use HasFactory, SoftDeletes;

    const VISIBILITY_GENERAL = 'general';

    const VISIBILITY_PRIVATE = 'private';

    protected $fillable = [
        'code',
        'name',
        'visibility',
        'description',
        'default_questions_count',
        'default_duration_minutes',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'default_questions_count' => 'integer',
            'default_duration_minutes' => 'integer',
        ];
    }

    public function competitions(): BelongsToMany
    {
        return $this->belongsToMany(Competition::class, 'competition_topic')
            ->using(CompetitionTopic::class)
            ->withPivot(['questions_count', 'duration_minutes', 'difficulty_distribution'])
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeGeneral($query)
    {
        return $query->where('visibility', self::VISIBILITY_GENERAL);
    }

    public function scopePrivate($query)
    {
        return $query->where('visibility', self::VISIBILITY_PRIVATE);
    }

    public function isGeneral(): bool
    {
        return $this->visibility === self::VISIBILITY_GENERAL;
    }

    public function isPrivate(): bool
    {
        return $this->visibility === self::VISIBILITY_PRIVATE;
    }
}
