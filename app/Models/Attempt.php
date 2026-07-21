<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property Carbon|null $started_at
 * @property Carbon|null $finished_at
 */
class Attempt extends Model
{
    use SoftDeletes;

    const TYPE_PRACTICE = 'practice';

    const TYPE_EXAM = 'exam';

    const STATUS_IN_PROGRESS = 'in_progress';

    const STATUS_COMPLETED = 'completed';

    const STATUS_ABANDONED = 'abandoned';

    protected $appends = ['subject_name'];

    protected $fillable = [
        'user_id',
        'type',
        'topic_id',
        'competition_id',
        'status',
        'with_timer',
        'started_at',
        'finished_at',
        'total_questions',
        'answered_count',
        'correct_answers',
        'score_percentage',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'finished_at' => 'datetime',
            'total_questions' => 'integer',
            'answered_count' => 'integer',
            'correct_answers' => 'integer',
            'with_timer' => 'boolean',
            'score_percentage' => 'float',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Topic, $this> */
    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    /** @return BelongsTo<Competition, $this> */
    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }

    /** @return HasOne<UserScore, $this> */
    public function score(): HasOne
    {
        return $this->hasOne(UserScore::class);
    }

    /** @return HasMany<AttemptSection, $this> */
    public function sections(): HasMany
    {
        return $this->hasMany(AttemptSection::class)->orderBy('order');
    }

    public function isPractice(): bool
    {
        return $this->type === self::TYPE_PRACTICE;
    }

    public function isExam(): bool
    {
        return $this->type === self::TYPE_EXAM;
    }

    public function isInProgress(): bool
    {
        return $this->status === self::STATUS_IN_PROGRESS;
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function getSubjectNameAttribute(): string
    {
        if ($this->isPractice()) {
            return $this->topic->name ?? '—';
        }

        return $this->competition->name ?? '—';
    }
}
