<?php

namespace App\Models;

use Database\Factories\CompetitionFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Competition extends Model
{
    /** @use HasFactory<CompetitionFactory> */
    use HasFactory, SoftDeletes;

    const CLASSIFICATION_CONTAINER = 'container';

    const CLASSIFICATION_STANDALONE = 'standalone';

    const CLASSIFICATION_CHILD = 'child';

    protected $fillable = [
        'classification',
        'parent_id',
        'order',
        'code',
        'slug',
        'name',
        'image',
        'color',
        'icon',
        'description',
        'is_active',
        'start_date',
        'end_date',
    ];

    protected $appends = ['image_url', 'can_have_topics'];

    protected function casts(): array
    {
        return [
            'classification' => 'string',
            'is_active' => 'boolean',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        return asset('storage/'.$this->image);
    }

    /** @return BelongsTo<Competition, $this> */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Competition::class, 'parent_id');
    }

    /** @return HasMany<Competition, $this> */
    public function children(): HasMany
    {
        return $this->hasMany(Competition::class, 'parent_id');
    }

    /** @return HasMany<Attempt, $this> */
    public function attempts(): HasMany
    {
        return $this->hasMany(Attempt::class)->where('type', Attempt::TYPE_EXAM);
    }

    /** @return BelongsToMany<User, $this> */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'competition_user')
            ->withPivot('joined_at')
            ->withTimestamps();
    }

    /** @return BelongsToMany<Topic, $this, CompetitionTopic> */
    public function topics(): BelongsToMany
    {
        return $this->belongsToMany(Topic::class, 'competition_topic')
            ->using(CompetitionTopic::class)
            ->withPivot(['questions_count', 'duration_minutes', 'difficulty_distribution'])
            ->withTimestamps();
    }

    public function getCanHaveTopicsAttribute(): bool
    {
        return ! $this->isContainer();
    }

    /** @param Builder<self> $query */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /** @param Builder<self> $query */
    public function scopeRoots(Builder $query): void
    {
        $query->whereNull('parent_id');
    }

    public function getRootId(): int
    {
        return $this->parent_id ?? $this->id;
    }

    public function isContainer(): bool
    {
        return $this->classification === self::CLASSIFICATION_CONTAINER;
    }

    public function isStandalone(): bool
    {
        return $this->classification === self::CLASSIFICATION_STANDALONE;
    }

    public function isChild(): bool
    {
        return $this->classification === self::CLASSIFICATION_CHILD;
    }

    public function isUpcoming(): bool
    {
        return $this->start_date !== null && $this->start_date->isFuture();
    }

    public function isOngoing(): bool
    {
        if ($this->start_date !== null && $this->start_date->isFuture()) {
            return false;
        }

        return ! ($this->end_date !== null && $this->end_date->isPast());
    }

    public function isEnded(): bool
    {
        return $this->end_date !== null && $this->end_date->isPast();
    }

    /** @param Builder<self> $query */
    public function scopeUpcoming(Builder $query): void
    {
        $query->whereNotNull('start_date')->where('start_date', '>', now());
    }

    /** @param Builder<self> $query */
    public function scopeOngoing(Builder $query): void
    {
        $query->where(function (Builder $q) {
            $q->whereNull('start_date')->orWhere('start_date', '<=', now());
        })->where(function (Builder $q) {
            $q->whereNull('end_date')->orWhere('end_date', '>', now());
        });
    }

    /** @param Builder<self> $query */
    public function scopeEnded(Builder $query): void
    {
        $query->whereNotNull('end_date')->where('end_date', '<=', now());
    }

    public function canBeParentOf(): bool
    {
        return $this->isContainer();
    }
}
