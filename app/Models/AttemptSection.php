<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttemptSection extends Model
{
    protected $fillable = [
        'attempt_id',
        'topic_id',
        'questions_count',
        'duration_minutes',
        'order',
        'started_at',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'questions_count' => 'integer',
            'duration_minutes' => 'integer',
            'order' => 'integer',
            'started_at' => 'datetime',
            'submitted_at' => 'datetime',
        ];
    }

    public function isSubmitted(): bool
    {
        return $this->submitted_at !== null;
    }

    public function isExpired(): bool
    {
        if ($this->duration_minutes === null) {
            return false;
        }

        if ($this->started_at === null) {
            return false;
        }

        return $this->started_at->copy()->addMinutes($this->duration_minutes)->isPast();
    }

    /** @return BelongsTo<Attempt, $this> */
    public function attempt(): BelongsTo
    {
        return $this->belongsTo(Attempt::class);
    }

    /** @return BelongsTo<Topic, $this> */
    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    /** @return HasMany<AttemptQuestion, $this> */
    public function questions(): HasMany
    {
        return $this->hasMany(AttemptQuestion::class)->orderBy('order');
    }
}
