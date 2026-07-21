<?php

use App\Models\Attempt;
use App\Models\Competition;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Topic;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'student']);
});

function createPracticeAttempt($testCase, User $user): Attempt
{
    $topic = Topic::factory()->active()->create(['default_questions_count' => 3]);
    Question::factory(3)->active()->for($topic)->create()->each(function ($q) {
        QuestionOption::factory()->for($q)->correct()->create(['order' => 0]);
        QuestionOption::factory(3)->for($q)->create(['order' => 1]);
    });

    $testCase->actingAs($user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);

    return Attempt::where('user_id', $user->id)->with('sections.questions.question.options')->first();
}

// ─── Answering Questions ──────────────────────────────────────

it('student can answer a question in practice', function () {
    $attempt = createPracticeAttempt($this, $this->user);
    $attemptQuestion = $attempt->sections->first()->questions->first();
    $correctOption = $attemptQuestion->question->options->firstWhere('is_correct', true);

    $response = $this->actingAs($this->user)->patch(
        route('student.attempts.questions.update', [$attempt, $attemptQuestion]),
        ['selected_option_id' => $correctOption->id],
    );

    $response->assertRedirect();

    $attemptQuestion->refresh();
    expect($attemptQuestion->selected_option_id)->toBe($correctOption->id);
    expect($attemptQuestion->is_correct)->toBeTrue();
});

it('student can change answer in practice mode', function () {
    $attempt = createPracticeAttempt($this, $this->user);
    $attemptQuestion = $attempt->sections->first()->questions->first();
    $correctOption = $attemptQuestion->question->options->firstWhere('is_correct', true);
    $wrongOption = $attemptQuestion->question->options->firstWhere('is_correct', false);

    $this->actingAs($this->user)->patch(
        route('student.attempts.questions.update', [$attempt, $attemptQuestion]),
        ['selected_option_id' => $wrongOption->id],
    );

    $this->actingAs($this->user)->patch(
        route('student.attempts.questions.update', [$attempt, $attemptQuestion]),
        ['selected_option_id' => $correctOption->id],
    );

    $attemptQuestion->refresh();
    expect($attemptQuestion->selected_option_id)->toBe($correctOption->id);
    expect($attemptQuestion->is_correct)->toBeTrue();
});

it('student cannot change answer in exam mode', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, ['questions_count' => 1, 'duration_minutes' => 10, 'difficulty_distribution' => null]);
    $question = Question::factory()->active()->for($topic)->create();
    $correctOption = QuestionOption::factory()->for($question)->correct()->create(['order' => 0]);
    $wrongOption = QuestionOption::factory()->for($question)->create(['order' => 1]);
    $this->user->competitions()->attach($competition, ['joined_at' => now()]);

    $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));
    $attempt = Attempt::where('user_id', $this->user->id)->first();
    $attemptQuestion = $attempt->sections->first()->questions->first();

    $this->actingAs($this->user)->patch(
        route('student.attempts.questions.update', [$attempt, $attemptQuestion]),
        ['selected_option_id' => $correctOption->id],
    );

    $response = $this->actingAs($this->user)->patch(
        route('student.attempts.questions.update', [$attempt, $attemptQuestion]),
        ['selected_option_id' => $wrongOption->id],
    );

    $response->assertSessionHasErrors('attempt');
    $attemptQuestion->refresh();
    expect($attemptQuestion->selected_option_id)->toBe($correctOption->id);
});

it('rejects option not belonging to the question', function () {
    $attempt = createPracticeAttempt($this, $this->user);
    $attemptQuestion = $attempt->sections->first()->questions->first();
    $otherQuestion = $attempt->sections->first()->questions->last();
    $foreignOption = $otherQuestion->question->options->first();

    $response = $this->actingAs($this->user)->patch(
        route('student.attempts.questions.update', [$attempt, $attemptQuestion]),
        ['selected_option_id' => $foreignOption->id],
    );

    $response->assertSessionHasErrors('selected_option_id');
});

// ─── Finishing Attempts ───────────────────────────────────────

it('student can finish an attempt with partial answers', function () {
    $attempt = createPracticeAttempt($this, $this->user);
    $aq = $attempt->sections->first()->questions->first();
    $correctOption = $aq->question->options->firstWhere('is_correct', true);

    $this->actingAs($this->user)->patch(
        route('student.attempts.questions.update', [$attempt, $aq]),
        ['selected_option_id' => $correctOption->id],
    );

    $response = $this->actingAs($this->user)->post(
        route('student.attempts.finish', $attempt),
    );

    $response->assertRedirect();

    $attempt->refresh();
    expect($attempt->status)->toBe('completed');
    expect($attempt->finished_at)->not->toBeNull();
    expect($attempt->correct_answers)->toBe(1);
});

it('finish calculates correct answers correctly', function () {
    $attempt = createPracticeAttempt($this, $this->user);

    foreach ($attempt->sections->first()->questions as $aq) {
        $correctOption = $aq->question->options->firstWhere('is_correct', true);
        $this->actingAs($this->user)->patch(
            route('student.attempts.questions.update', [$attempt, $aq]),
            ['selected_option_id' => $correctOption->id],
        );
    }

    $this->actingAs($this->user)->post(route('student.attempts.finish', $attempt));

    $attempt->refresh();
    expect($attempt->correct_answers)->toBe(3);
});

// ─── IDOR ─────────────────────────────────────────────────────

it('prevents student from viewing another students attempt', function () {
    $other = User::factory()->create(['role' => 'student']);
    $otherAttempt = createPracticeAttempt($this, $other);

    $response = $this->actingAs($this->user)->get(
        route('student.attempts.show', $otherAttempt),
    );

    $response->assertForbidden();
});

it('prevents student from answering another students question', function () {
    $other = User::factory()->create(['role' => 'student']);
    $otherAttempt = createPracticeAttempt($this, $other);
    $aq = $otherAttempt->sections->first()->questions->first();
    $correctOption = $aq->question->options->firstWhere('is_correct', true);

    $response = $this->actingAs($this->user)->patch(
        route('student.attempts.questions.update', [$otherAttempt, $aq]),
        ['selected_option_id' => $correctOption->id],
    );

    $response->assertForbidden();
});

it('prevents student from finishing another students attempt', function () {
    $other = User::factory()->create(['role' => 'student']);
    $otherAttempt = createPracticeAttempt($this, $other);

    $response = $this->actingAs($this->user)->post(
        route('student.attempts.finish', $otherAttempt),
    );

    $response->assertForbidden();
});

it('guest cannot view attempt', function () {
    $attempt = createPracticeAttempt($this, $this->user);
    $this->app->make('auth')->logout();

    $response = $this->get(route('student.attempts.show', $attempt));

    $response->assertRedirect(route('login'));
});
