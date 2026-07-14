<?php

namespace App\Models;

use Database\Factories\CompetitionFactory;
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
    ];

    protected $appends = ['image_url', 'can_have_topics'];

    protected function casts(): array
    {
        return [
            'classification' => 'string',
            'is_active' => 'boolean',
        ];
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        return asset('storage/'.$this->image);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Competition::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Competition::class, 'parent_id');
    }

    public function topics(): BelongsToMany
    {
        return $this->belongsToMany(Topic::class, 'competition_topic')
            ->using(CompetitionTopic::class)
            ->withPivot(['questions_count', 'duration_minutes', 'difficulty_distribution'])
            ->withTimestamps();
    }

    public function getCanHaveTopicsAttribute(): bool
    {
        return $this->canHaveTopics();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
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

    public function canHaveTopics(): bool
    {
        return ! $this->isContainer();
    }

    public function canBeParentOf(): bool
    {
        return $this->isContainer();
    }
}
