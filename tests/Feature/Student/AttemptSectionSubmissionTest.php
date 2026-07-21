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

// ─── Section Submission ───────────────────────────────────────

it('submits a section and marks submitted_at', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, ['questions_count' => 1, 'duration_minutes' => 10, 'difficulty_distribution' => null]);
    Question::factory(1)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));
    $this->user->competitions()->attach($competition, ['joined_at' => now()]);

    $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));
    $attempt = Attempt::where('user_id', $this->user->id)->first();
    $section = $attempt->sections->first();

    expect($section->submitted_at)->toBeNull();

    $response = $this->actingAs($this->user)->post(
        route('student.attempts.sections.submit', [$attempt, $section]),
    );

    $response->assertRedirect();

    $section->refresh();
    expect($section->submitted_at)->not->toBeNull();
});

it('auto-completes attempt when all sections are submitted', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topicA = Topic::factory()->active()->create();
    $topicB = Topic::factory()->active()->create();
    $competition->topics()->attach($topicA, ['questions_count' => 1, 'duration_minutes' => 10, 'difficulty_distribution' => null]);
    $competition->topics()->attach($topicB, ['questions_count' => 1, 'duration_minutes' => 10, 'difficulty_distribution' => null]);
    Question::factory(1)->active()->for($topicA)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));
    Question::factory(1)->active()->for($topicB)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));
    $this->user->competitions()->attach($competition, ['joined_at' => now()]);

    $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));
    $attempt = Attempt::where('user_id', $this->user->id)->first();
    $sectionA = $attempt->sections->first();
    $sectionB = $attempt->sections->last();

    $this->actingAs($this->user)->post(
        route('student.attempts.sections.submit', [$attempt, $sectionA]),
    );

    $attempt->refresh();
    expect($attempt->status)->toBe('in_progress');

    $this->actingAs($this->user)->post(
        route('student.attempts.sections.submit', [$attempt, $sectionB]),
    );

    $attempt->refresh();
    expect($attempt->status)->toBe('completed');
    expect($attempt->finished_at)->not->toBeNull();
});

it('calculates correct_answers on auto-complete', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, ['questions_count' => 3, 'duration_minutes' => 10, 'difficulty_distribution' => null]);
    $question1 = Question::factory()->active()->for($topic)->create();
    $question2 = Question::factory()->active()->for($topic)->create();
    $question3 = Question::factory()->active()->for($topic)->create();
    QuestionOption::factory()->for($question1)->correct()->create(['order' => 0]);
    QuestionOption::factory()->for($question2)->correct()->create(['order' => 0]);
    QuestionOption::factory()->for($question3)->correct()->create(['order' => 0]);
    QuestionOption::factory(2)->for($question1)->create(['order' => 1]);
    QuestionOption::factory(2)->for($question2)->create(['order' => 1]);
    QuestionOption::factory(2)->for($question3)->create(['order' => 1]);
    $this->user->competitions()->attach($competition, ['joined_at' => now()]);

    $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));
    $attempt = Attempt::where('user_id', $this->user->id)->first();
    $section = $attempt->sections->first();

    $aqs = $section->questions;
    $aqs[0]->update(['selected_option_id' => $aqs[0]->question->options->firstWhere('is_correct', true)->id, 'is_correct' => true]);
    $aqs[1]->update(['selected_option_id' => $aqs[1]->question->options->firstWhere('is_correct', false)->id, 'is_correct' => false]);

    $this->actingAs($this->user)->post(
        route('student.attempts.sections.submit', [$attempt, $section]),
    );

    $attempt->refresh();
    expect($attempt->correct_answers)->toBe(1);
});

// ─── Guard clauses ────────────────────────────────────────────

it('prevents submitting another users section', function () {
    $other = User::factory()->create(['role' => 'student']);
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, ['questions_count' => 1, 'duration_minutes' => 10, 'difficulty_distribution' => null]);
    Question::factory(1)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));

    $other->competitions()->attach($competition, ['joined_at' => now()]);
    $this->actingAs($other)->post(route('student.competitions.attempts.start', $competition));
    $otherAttempt = Attempt::where('user_id', $other->id)->first();
    $section = $otherAttempt->sections->first();

    $response = $this->actingAs($this->user)->post(
        route('student.attempts.sections.submit', [$otherAttempt, $section]),
    );

    $response->assertForbidden();
});

it('prevents submitting a section twice', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, ['questions_count' => 1, 'duration_minutes' => 10, 'difficulty_distribution' => null]);
    Question::factory(1)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));
    $this->user->competitions()->attach($competition, ['joined_at' => now()]);

    $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));
    $attempt = Attempt::where('user_id', $this->user->id)->first();
    $section = $attempt->sections->first();

    $this->actingAs($this->user)->post(
        route('student.attempts.sections.submit', [$attempt, $section]),
    );

    $response = $this->actingAs($this->user)->post(
        route('student.attempts.sections.submit', [$attempt, $section]),
    );

    $response->assertStatus(422);
});

it('prevents submitting section of a completed attempt', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, ['questions_count' => 1, 'duration_minutes' => 10, 'difficulty_distribution' => null]);
    Question::factory(1)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));
    $this->user->competitions()->attach($competition, ['joined_at' => now()]);

    $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));
    $attempt = Attempt::where('user_id', $this->user->id)->first();
    $section = $attempt->sections->first();

    $attempt->update(['status' => Attempt::STATUS_COMPLETED, 'finished_at' => now()]);

    $response = $this->actingAs($this->user)->post(
        route('student.attempts.sections.submit', [$attempt, $section]),
    );

    $response->assertStatus(422);
});

it('finish submits all unsubmitted sections for exam', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topicA = Topic::factory()->active()->create();
    $topicB = Topic::factory()->active()->create();
    $competition->topics()->attach($topicA, ['questions_count' => 1, 'duration_minutes' => 10, 'difficulty_distribution' => null]);
    $competition->topics()->attach($topicB, ['questions_count' => 1, 'duration_minutes' => 10, 'difficulty_distribution' => null]);
    Question::factory(1)->active()->for($topicA)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));
    Question::factory(1)->active()->for($topicB)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));
    $this->user->competitions()->attach($competition, ['joined_at' => now()]);

    $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));
    $attempt = Attempt::where('user_id', $this->user->id)->first();
    $sectionA = $attempt->sections->first();

    $this->actingAs($this->user)->post(
        route('student.attempts.sections.submit', [$attempt, $sectionA]),
    );

    $this->actingAs($this->user)->post(route('student.attempts.finish', $attempt));

    $attempt->refresh();
    expect($attempt->status)->toBe('completed');

    $unsubmitted = $attempt->sections()->whereNull('submitted_at')->count();
    expect($unsubmitted)->toBe(0);
});

it('does not mark sections as submitted on finish for practice', function () {
    $topic = Topic::factory()->active()->create(['default_questions_count' => 1]);
    Question::factory(1)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));

    $this->actingAs($this->user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);
    $attempt = Attempt::where('user_id', $this->user->id)->first();

    $this->actingAs($this->user)->post(route('student.attempts.finish', $attempt));

    $attempt->refresh();
    expect($attempt->status)->toBe('completed');

    $submitted = $attempt->sections()->whereNotNull('submitted_at')->count();
    expect($submitted)->toBe(0);
});
