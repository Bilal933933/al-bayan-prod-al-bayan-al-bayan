<?php

namespace App\Models;

use Database\Factories\TopicFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $user_attempts_count
 * @property bool $has_in_progress
 * @property int|null $in_progress_attempt_id
 * @property array{correct: int, total: int}|null $best_score
 * @property-read CompetitionTopic $pivot
 */
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

    /** @return HasMany<Question, $this> */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    /** @return HasMany<Attempt, $this> */
    public function attempts(): HasMany
    {
        return $this->hasMany(Attempt::class)->where('type', Attempt::TYPE_PRACTICE);
    }

    /** @return BelongsToMany<Competition, $this, CompetitionTopic> */
    public function competitions(): BelongsToMany
    {
        return $this->belongsToMany(Competition::class, 'competition_topic')
            ->using(CompetitionTopic::class)
            ->withPivot(['questions_count', 'duration_minutes', 'difficulty_distribution'])
            ->withTimestamps();
    }

    /** @param Builder<self> $query */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /** @param Builder<self> $query */
    public function scopeGeneral(Builder $query): void
    {
        $query->where('visibility', self::VISIBILITY_GENERAL);
    }

    /** @param Builder<self> $query */
    public function scopePrivate(Builder $query): void
    {
        $query->where('visibility', self::VISIBILITY_PRIVATE);
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
