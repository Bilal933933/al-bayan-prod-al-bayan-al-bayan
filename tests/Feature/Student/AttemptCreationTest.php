<?php

use App\Models\Attempt;
use App\Models\Competition;
use App\Models\Question;
use App\Models\Topic;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'student']);
});

// ─── Practice Attempts ───────────────────────────────────────

it('student can start a practice attempt', function () {
    $topic = Topic::factory()->active()->create(['default_questions_count' => 5]);
    Question::factory(5)->active()->for($topic)->create();

    $response = $this->actingAs($this->user)->post(route('student.topics.attempts.start', $topic));

    $response->assertRedirect();

    $attempt = Attempt::where('user_id', $this->user->id)->first();
    expect($attempt)->not->toBeNull()
        ->type->toBe('practice')
        ->topic_id->toBe($topic->id)
        ->total_questions->toBe(5);

    expect($attempt->sections)->toHaveCount(1);
    expect($attempt->sections->first()->questions)->toHaveCount(5);
});

it('prevents practice on inactive topic', function () {
    $topic = Topic::factory()->inactive()->create();

    $response = $this->actingAs($this->user)->post(route('student.topics.attempts.start', $topic));

    $response->assertNotFound();
});

it('practice with fewer active questions than default count still succeeds', function () {
    $topic = Topic::factory()->active()->create(['default_questions_count' => 10]);
    Question::factory(3)->active()->for($topic)->create();

    $response = $this->actingAs($this->user)->post(route('student.topics.attempts.start', $topic));

    $response->assertRedirect();

    $attempt = Attempt::where('user_id', $this->user->id)->first();
    expect($attempt->total_questions)->toBe(3);
});

// ─── Exam Attempts ───────────────────────────────────────────

it('student can start an exam attempt with one topic', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, [
        'questions_count' => 4,
        'duration_minutes' => 10,
        'difficulty_distribution' => ['easy' => 25, 'medium' => 50, 'hard' => 25],
    ]);
    Question::factory(2)->active()->for($topic)->easy()->create();
    Question::factory(2)->active()->for($topic)->medium()->create();
    Question::factory(1)->active()->for($topic)->hard()->create();

    $response = $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));

    $response->assertRedirect();

    $attempt = Attempt::where('user_id', $this->user->id)->first();
    expect($attempt)->not->toBeNull()
        ->type->toBe('exam')
        ->competition_id->toBe($competition->id);

    expect($attempt->sections)->toHaveCount(1);
    expect($attempt->sections->first()->questions)->toHaveCount(4);
});

it('student can start an exam attempt with multiple topics', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topicA = Topic::factory()->active()->create();
    $topicB = Topic::factory()->active()->create();
    $competition->topics()->attach($topicA, [
        'questions_count' => 3,
        'duration_minutes' => 10,
        'difficulty_distribution' => null,
    ]);
    $competition->topics()->attach($topicB, [
        'questions_count' => 2,
        'duration_minutes' => 5,
        'difficulty_distribution' => null,
    ]);
    Question::factory(3)->active()->for($topicA)->create();
    Question::factory(2)->active()->for($topicB)->create();

    $response = $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));

    $response->assertRedirect();

    $attempt = Attempt::where('user_id', $this->user->id)->first();
    expect($attempt->sections)->toHaveCount(2);
    expect($attempt->total_questions)->toBe(5);
});

it('prevents exam on container competition', function () {
    $competition = Competition::factory()->container()->active()->create();

    $response = $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));

    $response->assertForbidden();
});

it('prevents exam with no active topics', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->inactive()->create();
    $competition->topics()->attach($topic, [
        'questions_count' => 5,
        'duration_minutes' => 10,
        'difficulty_distribution' => null,
    ]);

    $response = $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));

    $response->assertStatus(422);
});

it('exam handles insufficient questions gracefully', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, [
        'questions_count' => 10,
        'duration_minutes' => 20,
        'difficulty_distribution' => ['easy' => 50, 'medium' => 30, 'hard' => 20],
    ]);
    Question::factory(2)->active()->for($topic)->easy()->create();
    Question::factory(1)->active()->for($topic)->medium()->create();

    $response = $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));

    $response->assertRedirect();

    $attempt = Attempt::where('user_id', $this->user->id)->first();
    expect($attempt->total_questions)->toBe(3);
});

it('exam respects difficulty distribution approximately', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, [
        'questions_count' => 10,
        'duration_minutes' => 20,
        'difficulty_distribution' => ['easy' => 40, 'medium' => 40, 'hard' => 20],
    ]);
    Question::factory(4)->active()->for($topic)->easy()->create();
    Question::factory(4)->active()->for($topic)->medium()->create();
    Question::factory(4)->active()->for($topic)->hard()->create();

    $response = $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));

    $response->assertRedirect();

    $attempt = Attempt::where('user_id', $this->user->id)->first();
    $difficulties = $attempt->sections->first()->questions->map(fn ($q) => $q->question->difficulty);
    expect($difficulties->filter(fn ($d) => $d === 'easy'))->toHaveCount(4);
    expect($difficulties->filter(fn ($d) => $d === 'medium'))->toHaveCount(4);
    expect($difficulties->filter(fn ($d) => $d === 'hard'))->toHaveCount(2);
});

// ─── Auth ─────────────────────────────────────────────────────

it('practice respects difficulty filter', function () {
    $topic = Topic::factory()->active()->create(['default_questions_count' => 10]);
    Question::factory(5)->active()->for($topic)->easy()->create();
    Question::factory(5)->active()->for($topic)->medium()->create();
    Question::factory(5)->active()->for($topic)->hard()->create();

    $response = $this->actingAs($this->user)->post(
        route('student.topics.attempts.start', $topic),
        ['difficulty' => 'easy'],
    );

    $response->assertRedirect();

    $attempt = Attempt::where('user_id', $this->user->id)->first();
    expect($attempt->total_questions)->toBe(5);

    $difficulties = $attempt->sections->first()->questions->map(fn ($aq) => $aq->question->difficulty);
    $difficulties->each(fn ($d) => expect($d)->toBe('easy'));
});

it('guest cannot create any attempt', function () {
    $topic = Topic::factory()->active()->create();

    $response = $this->post(route('student.topics.attempts.start', $topic));

    $response->assertRedirect(route('login'));
});
