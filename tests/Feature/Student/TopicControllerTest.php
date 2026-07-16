<?php

use App\Models\Attempt;
use App\Models\Topic;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'student']);
});

// ─── Index ────────────────────────────────────────────────────

it('guest cannot access topics index', function () {
    $response = $this->get(route('student.topics.index'));

    $response->assertRedirect(route('login'));
});

it('shows empty state when no topics exist', function () {
    $response = $this->actingAs($this->user)->get(route('student.topics.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('student/topics/index')
        ->where('topics', [])
    );
});

it('lists only active topics', function () {
    Topic::factory()->active()->create(['name' => 'Active A']);
    Topic::factory()->active()->create(['name' => 'Active B']);
    Topic::factory()->inactive()->create(['name' => 'Inactive C']);

    $response = $this->actingAs($this->user)->get(route('student.topics.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('topics', 2)
        ->where('topics.0.name', 'Active A')
        ->where('topics.1.name', 'Active B')
    );
});

it('includes topic fields required by the page', function () {
    Topic::factory()->active()->create();

    $response = $this->actingAs($this->user)->get(route('student.topics.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('topics.0', fn ($topic) => $topic
            ->has('id')
            ->has('code')
            ->has('name')
            ->has('visibility')
            ->has('description')
            ->has('default_questions_count')
            ->has('default_duration_minutes')
            ->has('user_attempts_count')
            ->has('has_in_progress')
            ->has('in_progress_attempt_id')
            ->has('best_score')
        )
    );
});

it('returns zero attempt stats when no attempts exist', function () {
    Topic::factory()->active()->create();

    $response = $this->actingAs($this->user)->get(route('student.topics.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('topics.0.user_attempts_count', 0)
        ->where('topics.0.has_in_progress', false)
        ->where('topics.0.in_progress_attempt_id', null)
        ->where('topics.0.best_score', null)
    );
});

it('counts only practice attempts per topic', function () {
    $topicA = Topic::factory()->active()->create();
    $topicB = Topic::factory()->active()->create();

    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topicA->id, 'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(), 'finished_at' => now(),
        'total_questions' => 10, 'correct_answers' => 8,
    ]);
    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topicA->id, 'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHours(2), 'finished_at' => now()->subHour(),
        'total_questions' => 5, 'correct_answers' => 3,
    ]);
    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topicB->id, 'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHours(3), 'finished_at' => now()->subHours(2),
        'total_questions' => 20, 'correct_answers' => 10,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.topics.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('topics.0.user_attempts_count', 2)
        ->where('topics.1.user_attempts_count', 1)
    );
});

it('detects in_progress attempt and returns its id', function () {
    $topic = Topic::factory()->active()->create();
    $attempt = Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id, 'status' => Attempt::STATUS_IN_PROGRESS,
        'started_at' => now(),
    ]);

    $response = $this->actingAs($this->user)->get(route('student.topics.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('topics.0.has_in_progress', true)
        ->where('topics.0.in_progress_attempt_id', $attempt->id)
    );
});

it('best_score returns null when no completed attempts', function () {
    $topic = Topic::factory()->active()->create();
    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id, 'status' => Attempt::STATUS_IN_PROGRESS,
        'started_at' => now(),
    ]);

    $response = $this->actingAs($this->user)->get(route('student.topics.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('topics.0.best_score', null)
    );
});

it('best_score returns highest scoring completed attempt', function () {
    $topic = Topic::factory()->active()->create();
    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id, 'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHours(2), 'finished_at' => now()->subHour(),
        'total_questions' => 5, 'correct_answers' => 3,
    ]);
    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id, 'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(), 'finished_at' => now(),
        'total_questions' => 10, 'correct_answers' => 9,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.topics.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('topics.0.best_score.correct', 9)
        ->where('topics.0.best_score.total', 10)
    );
});

it('ignores exam type attempts in topic stats', function () {
    $topic = Topic::factory()->active()->create();
    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_EXAM,
        'topic_id' => $topic->id, 'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(), 'finished_at' => now(),
        'total_questions' => 10, 'correct_answers' => 8,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.topics.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('topics.0.user_attempts_count', 0)
        ->where('topics.0.best_score', null)
    );
});

// ─── Show ─────────────────────────────────────────────────────

it('guest cannot access topic show', function () {
    $topic = Topic::factory()->active()->create();

    $response = $this->get(route('student.topics.show', $topic));

    $response->assertRedirect(route('login'));
});

it('returns 404 for inactive topic', function () {
    $topic = Topic::factory()->inactive()->create();

    $response = $this->actingAs($this->user)->get(route('student.topics.show', $topic));

    $response->assertNotFound();
});

it('shows topic details', function () {
    $topic = Topic::factory()->active()->create(['name' => 'Algebra']);

    $response = $this->actingAs($this->user)->get(route('student.topics.show', $topic));

    $response->assertInertia(fn ($page) => $page
        ->component('student/topics/show')
        ->where('topic.name', 'Algebra')
    );
});

it('user_stats_has_zero_values_when_no_attempts', function () {
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->user)->get(route('student.topics.show', $topic));

    $response->assertInertia(fn ($page) => $page
        ->where('userStats.total_attempts', 0)
        ->where('userStats.last_practice_at', null)
        ->where('userStats.best_score', null)
        ->where('userStats.average_percentage', null)
        ->where('hasInProgress', false)
        ->where('inProgressAttemptId', null)
        ->where('recentAttempts', [])
    );
});

it('calculates user_stats_from_attempts', function () {
    $topic = Topic::factory()->active()->create();
    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id, 'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHours(2), 'finished_at' => now()->subHour(),
        'total_questions' => 10, 'correct_answers' => 8,
    ]);
    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id, 'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(), 'finished_at' => now(),
        'total_questions' => 5, 'correct_answers' => 3,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.topics.show', $topic));

    $response->assertInertia(fn ($page) => $page
        ->where('userStats.total_attempts', 2)
        ->where('userStats.average_percentage', 73)
        ->where('userStats.best_score.correct_answers', 8)
        ->where('userStats.best_score.total_questions', 10)
    );
});

it('average_percentage_is_null_when_no_completed_attempts', function () {
    $topic = Topic::factory()->active()->create();
    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id, 'status' => Attempt::STATUS_IN_PROGRESS,
        'started_at' => now(),
    ]);

    $response = $this->actingAs($this->user)->get(route('student.topics.show', $topic));

    $response->assertInertia(fn ($page) => $page
        ->where('userStats.average_percentage', null)
    );
});

it('detects_in_progress_attempt', function () {
    $topic = Topic::factory()->active()->create();
    $attempt = Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id, 'status' => Attempt::STATUS_IN_PROGRESS,
        'started_at' => now(),
    ]);

    $response = $this->actingAs($this->user)->get(route('student.topics.show', $topic));

    $response->assertInertia(fn ($page) => $page
        ->where('hasInProgress', true)
        ->where('inProgressAttemptId', $attempt->id)
    );
});

it('limits_recent_attempts_to_5', function () {
    $topic = Topic::factory()->active()->create();
    foreach (range(1, 7) as $i) {
        Attempt::create([
            'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
            'topic_id' => $topic->id, 'status' => Attempt::STATUS_COMPLETED,
            'started_at' => now()->subHours(8 - $i),
            'finished_at' => now()->subHours(8 - $i)->addMinutes(30),
            'total_questions' => 10, 'correct_answers' => $i,
        ]);
    }

    $response = $this->actingAs($this->user)->get(route('student.topics.show', $topic));

    $response->assertInertia(fn ($page) => $page
        ->has('recentAttempts', 5)
    );
});

it('recent_attempts_include_required_fields', function () {
    $topic = Topic::factory()->active()->create();
    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id, 'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(), 'finished_at' => now(),
        'total_questions' => 10, 'correct_answers' => 7,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.topics.show', $topic));

    $response->assertInertia(fn ($page) => $page
        ->has('recentAttempts.0', fn ($item) => $item
            ->has('id')
            ->has('status')
            ->has('correct_answers')
            ->has('total_questions')
            ->has('created_at')
        )
    );
});
