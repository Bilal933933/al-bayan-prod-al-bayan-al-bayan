<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $fillable = [
        'user_id',
        'question_id',
        'type',
        'description',
        'admin_response',
        'admin_response_at',
        'admin_read_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'question_id' => 'integer',
            'admin_response_at' => 'datetime',
            'admin_read_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Question, $this> */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    /** @param Builder<Report> $query */
    public function scopeUnreadResponse(Builder $query): void
    {
        $query->whereNotNull('admin_response')
            ->whereNull('admin_read_at');
    }
}
