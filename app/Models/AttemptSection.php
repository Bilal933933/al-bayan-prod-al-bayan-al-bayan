<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttemptSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'attempt_id',
        'topic_id',
        'questions_count',
        'duration_minutes',
        'order',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'questions_count' => 'integer',
            'duration_minutes' => 'integer',
            'order' => 'integer',
            'submitted_at' => 'datetime',
        ];
    }

    public function isSubmitted(): bool
    {
        return $this->submitted_at !== null;
    }

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(Attempt::class);
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(AttemptQuestion::class)->orderBy('order');
    }
}
