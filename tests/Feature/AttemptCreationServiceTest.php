<?php

use App\Models\Attempt;
use App\Models\Competition;
use App\Models\Question;
use App\Models\Topic;
use App\Models\User;
use App\Services\AttemptCreationService;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'student']);
    $this->service = app(AttemptCreationService::class);
});

// ─── createPractice ───────────────────────────────────────────

it('creates a practice attempt with questions', function () {
    $topic = Topic::factory()->active()->create(['default_questions_count' => 3]);
    Question::factory(3)->active()->for($topic)->create();

    $attempt = $this->service->createPractice($this->user, $topic);

    expect($attempt)->toBeInstanceOf(Attempt::class);
    expect($attempt->type)->toBe('practice');
    expect($attempt->status)->toBe('in_progress');
    expect($attempt->total_questions)->toBe(3);
    expect($attempt->sections)->toHaveCount(1);
    expect($attempt->sections->first()->questions)->toHaveCount(3);
});

it('limits practice questions to default_questions_count', function () {
    $topic = Topic::factory()->active()->create(['default_questions_count' => 5]);
    Question::factory(20)->active()->for($topic)->create();

    $attempt = $this->service->createPractice($this->user, $topic);

    expect($attempt->total_questions)->toBe(5);
    expect($attempt->sections->first()->questions)->toHaveCount(5);
});

it('filters practice questions by difficulty', function () {
    $topic = Topic::factory()->active()->create(['default_questions_count' => 10]);
    Question::factory(5)->active()->for($topic)->easy()->create();
    Question::factory(5)->active()->for($topic)->medium()->create();
    Question::factory(5)->active()->for($topic)->hard()->create();

    $attempt = $this->service->createPractice($this->user, $topic, 'easy');

    $attempt->sections->first()->questions->each(function ($aq) {
        expect($aq->question->difficulty)->toBe('easy');
    });
});

it('selects only active questions for practice', function () {
    $topic = Topic::factory()->active()->create(['default_questions_count' => 10]);
    Question::factory(3)->active()->for($topic)->create();
    Question::factory(5)->inactive()->for($topic)->create();

    $attempt = $this->service->createPractice($this->user, $topic);

    expect($attempt->total_questions)->toBe(3);
});

it('creates practice section with correct duration', function () {
    $topic = Topic::factory()->active()->create([
        'default_questions_count' => 2,
        'default_duration_minutes' => 30,
    ]);
    Question::factory(2)->active()->for($topic)->create();

    $attempt = $this->service->createPractice($this->user, $topic);

    $section = $attempt->sections->first();
    expect($section->duration_minutes)->toBe(30);
    expect($section->order)->toBe(0);
});

// ─── createExam ───────────────────────────────────────────────

it('creates an exam attempt with sections per topic', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topicA = Topic::factory()->active()->create();
    $topicB = Topic::factory()->active()->create();
    $competition->topics()->attach($topicA, [
        'questions_count' => 3, 'duration_minutes' => 10, 'difficulty_distribution' => null,
    ]);
    $competition->topics()->attach($topicB, [
        'questions_count' => 2, 'duration_minutes' => 5, 'difficulty_distribution' => null,
    ]);
    Question::factory(5)->active()->for($topicA)->create();
    Question::factory(5)->active()->for($topicB)->create();

    $attempt = $this->service->createExam($this->user, $competition);

    expect($attempt->type)->toBe('exam');
    expect($attempt->competition_id)->toBe($competition->id);
    expect($attempt->sections)->toHaveCount(2);
    expect($attempt->total_questions)->toBe(5);
});

it('assigns correct order to exam sections', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topicA = Topic::factory()->active()->create();
    $topicB = Topic::factory()->active()->create();
    $competition->topics()->attach($topicA, [
        'questions_count' => 2, 'duration_minutes' => 10, 'difficulty_distribution' => null,
    ]);
    $competition->topics()->attach($topicB, [
        'questions_count' => 2, 'duration_minutes' => 5, 'difficulty_distribution' => null,
    ]);
    Question::factory(2)->active()->for($topicA)->create();
    Question::factory(2)->active()->for($topicB)->create();

    $attempt = $this->service->createExam($this->user, $competition);

    expect($attempt->sections->get(0)->order)->toBe(0);
    expect($attempt->sections->get(1)->order)->toBe(1);
});

it('respects difficulty distribution in exam', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, [
        'questions_count' => 10,
        'duration_minutes' => 20,
        'difficulty_distribution' => ['easy' => 40, 'medium' => 40, 'hard' => 20],
    ]);
    Question::factory(5)->active()->for($topic)->easy()->create();
    Question::factory(5)->active()->for($topic)->medium()->create();
    Question::factory(5)->active()->for($topic)->hard()->create();

    $attempt = $this->service->createExam($this->user, $competition);

    $questions = $attempt->sections->first()->questions->load('question');
    expect($questions->filter(fn ($aq) => $aq->question->difficulty === 'easy'))->toHaveCount(4);
    expect($questions->filter(fn ($aq) => $aq->question->difficulty === 'medium'))->toHaveCount(4);
    expect($questions->filter(fn ($aq) => $aq->question->difficulty === 'hard'))->toHaveCount(2);
});

it('skips topics with no active questions in exam', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topicA = Topic::factory()->active()->create();
    $topicB = Topic::factory()->active()->create();
    $competition->topics()->attach($topicA, [
        'questions_count' => 3, 'duration_minutes' => 10, 'difficulty_distribution' => null,
    ]);
    $competition->topics()->attach($topicB, [
        'questions_count' => 3, 'duration_minutes' => 10, 'difficulty_distribution' => null,
    ]);
    Question::factory(3)->active()->for($topicA)->create();

    $attempt = $this->service->createExam($this->user, $competition);

    expect($attempt->sections)->toHaveCount(1);
    expect($attempt->total_questions)->toBe(3);
});

it('includes only active topics for exam', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $activeTopic = Topic::factory()->active()->create();
    $inactiveTopic = Topic::factory()->inactive()->create();
    $competition->topics()->attach($activeTopic, [
        'questions_count' => 2, 'duration_minutes' => 10, 'difficulty_distribution' => null,
    ]);
    $competition->topics()->attach($inactiveTopic, [
        'questions_count' => 5, 'duration_minutes' => 10, 'difficulty_distribution' => null,
    ]);
    Question::factory(5)->active()->for($activeTopic)->create();
    Question::factory(5)->active()->for($inactiveTopic)->create();

    $attempt = $this->service->createExam($this->user, $competition);

    expect($attempt->sections)->toHaveCount(1);
    expect($attempt->total_questions)->toBe(2);
});
