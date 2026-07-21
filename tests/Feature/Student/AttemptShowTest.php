<?php

use App\Models\Attempt;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Topic;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'student']);
});

function createPracticeAttemptData($testCase, User $user, int $questionCount = 3): Attempt
{
    $topic = Topic::factory()->active()->create(['default_questions_count' => $questionCount]);
    Question::factory($questionCount)->active()->for($topic)->create()->each(function ($q) {
        QuestionOption::factory()->for($q)->correct()->create(['order' => 0]);
        QuestionOption::factory(3)->for($q)->create(['order' => 1]);
    });

    $testCase->actingAs($user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);

    return Attempt::where('user_id', $user->id)->latest('id')->with('sections.questions')->first();
}

// ─── Show — Completed ─────────────────────────────────────────

it('shows completed attempt with full details', function () {
    $attempt = createPracticeAttemptData($this, $this->user);

    foreach ($attempt->sections->first()->questions as $aq) {
        $correctOption = $aq->question->options->firstWhere('is_correct', true);
        $this->actingAs($this->user)->patch(
            route('student.attempts.questions.update', [$attempt, $aq]),
            ['selected_option_id' => $correctOption->id],
        );
    }

    $this->actingAs($this->user)->post(route('student.attempts.finish', $attempt));
    $attempt->refresh();

    $response = $this->actingAs($this->user)->get(route('student.attempts.show', $attempt));

    $response->assertInertia(fn ($page) => $page
        ->component('student/attempts/show')
        ->where('attempt.id', $attempt->id)
        ->where('attempt.status', Attempt::STATUS_COMPLETED)
        ->has('attempt.sections')
        ->has('attempt.sections.0.questions')
        ->has('attempt.sections.0.questions.0.question.options')
        ->has('attempt.sections.0.questions.0.selected_option')
    );
});

it('completed attempt shows correct answer counts', function () {
    $attempt = createPracticeAttemptData($this, $this->user);
    $aq = $attempt->sections->first()->questions->first();
    $correctOption = $aq->question->options->firstWhere('is_correct', true);

    $this->actingAs($this->user)->patch(
        route('student.attempts.questions.update', [$attempt, $aq]),
        ['selected_option_id' => $correctOption->id],
    );

    $this->actingAs($this->user)->post(route('student.attempts.finish', $attempt));
    $attempt->refresh();

    $response = $this->actingAs($this->user)->get(route('student.attempts.show', $attempt));

    $response->assertInertia(fn ($page) => $page
        ->where('attempt.correct_answers', 1)
        ->where('attempt.total_questions', 3)
    );
});

// ─── Show — In Progress ───────────────────────────────────────

it('shows in_progress attempt with take page', function () {
    $attempt = createPracticeAttemptData($this, $this->user);

    $response = $this->actingAs($this->user)->get(route('student.attempts.show', $attempt));

    $response->assertInertia(fn ($page) => $page
        ->component('student/attempts/take')
        ->where('attempt.id', $attempt->id)
        ->where('attempt.status', Attempt::STATUS_IN_PROGRESS)
        ->has('attempt.sections')
        ->where('attempt.sections.0.topic_id', $attempt->sections->first()->topic_id)
    );
});

it('in_progress attempt does not include question details', function () {
    $attempt = createPracticeAttemptData($this, $this->user);

    $response = $this->actingAs($this->user)->get(route('student.attempts.show', $attempt));

    $response->assertInertia(fn ($page) => $page
        ->component('student/attempts/take')
        ->missing('attempt.sections.0.questions')
    );
});

// ─── Section ──────────────────────────────────────────────────

it('guest cannot access section endpoint', function () {
    $attempt = createPracticeAttemptData($this, $this->user);
    $section = $attempt->sections->first();

    $this->app->make('auth')->logout();

    $response = $this->get(route('student.attempts.sections.show', [$attempt, $section]));

    $response->assertRedirect(route('login'));
});

it('section endpoint returns 403 for other users attempt', function () {
    $other = User::factory()->create(['role' => 'student']);
    $attempt = createPracticeAttemptData($this, $other);
    $section = $attempt->sections->first();

    $response = $this->actingAs($this->user)->get(
        route('student.attempts.sections.show', [$attempt, $section]),
    );

    $response->assertForbidden();
});

it('section endpoint returns 404 for section not belonging to attempt', function () {
    $attemptA = createPracticeAttemptData($this, $this->user);
    $topic = Topic::factory()->active()->create(['default_questions_count' => 1]);
    Question::factory(1)->active()->for($topic)->create()->each(function ($q) {
        QuestionOption::factory()->for($q)->correct()->create(['order' => 0]);
    });

    $this->actingAs($this->user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);
    $attemptB = Attempt::where('user_id', $this->user->id)->latest('id')->with('sections')->first();

    $sectionB = $attemptB->sections->first();

    $response = $this->actingAs($this->user)->get(
        route('student.attempts.sections.show', [$attemptA, $sectionB]),
    );

    $response->assertNotFound();
});

it('section endpoint returns JSON with questions and options', function () {
    $attempt = createPracticeAttemptData($this, $this->user);
    $section = $attempt->sections->first();

    $response = $this->actingAs($this->user)->get(
        route('student.attempts.sections.show', [$attempt, $section]),
    );

    $response->assertOk()
        ->assertJsonStructure([
            'id',
            'topic',
            'questions' => [
                '*' => [
                    'id',
                    'question' => [
                        'id',
                        'text',
                        'options',
                    ],
                    'selected_option',
                ],
            ],
        ]);
});

it('section endpoint includes topic info', function () {
    $attempt = createPracticeAttemptData($this, $this->user);
    $section = $attempt->sections->first();

    $response = $this->actingAs($this->user)->get(
        route('student.attempts.sections.show', [$attempt, $section]),
    );

    $response->assertJsonStructure([
        'id',
        'topic' => ['id', 'name'],
        'questions',
    ]);

    $data = $response->json();
    expect($data['topic']['id'])->toBe($section->topic_id);
});
