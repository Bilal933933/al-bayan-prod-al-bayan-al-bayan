<?php

use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Topic;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

function createMcqOptions(): array
{
    return [
        ['text' => 'Correct', 'is_correct' => true],
        ['text' => 'Wrong A', 'is_correct' => false],
        ['text' => 'Wrong B', 'is_correct' => false],
    ];
}

// ─── Index ────────────────────────────────────────────────────

it('lists questions with topic and options_count', function () {
    $topic = Topic::factory()->active()->create();
    Question::factory(2)->active()->for($topic)->create()->each(function ($q) {
        QuestionOption::factory(3)->for($q)->create();
    });

    $response = $this->actingAs($this->admin)->get(route('admin.questions.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/questions/index')
        ->has('questions.data', 2)
        ->has('questions.data.0.topic')
        ->has('questions.data.0.options_count')
    );
});

it('filters questions by topic_id', function () {
    $topicA = Topic::factory()->active()->create();
    $topicB = Topic::factory()->active()->create();
    Question::factory()->for($topicA)->create();
    Question::factory()->for($topicB)->create();

    $response = $this->actingAs($this->admin)->get(
        route('admin.questions.index', ['topic_id' => $topicA->id]),
    );

    $response->assertInertia(fn ($page) => $page
        ->has('questions.data', 1)
    );
});

it('filters questions by difficulty', function () {
    $topic = Topic::factory()->active()->create();
    Question::factory()->for($topic)->easy()->create();
    Question::factory()->for($topic)->hard()->create();

    $response = $this->actingAs($this->admin)->get(
        route('admin.questions.index', ['difficulty' => 'easy']),
    );

    $response->assertInertia(fn ($page) => $page
        ->has('questions.data', 1)
        ->where('questions.data.0.difficulty', 'easy')
    );
});

it('filters questions by type', function () {
    $topic = Topic::factory()->active()->create();
    Question::factory()->for($topic)->mcq()->create();
    Question::factory()->for($topic)->trueFalse()->create();

    $response = $this->actingAs($this->admin)->get(
        route('admin.questions.index', ['filter' => 'mcq']),
    );

    $response->assertInertia(fn ($page) => $page
        ->has('questions.data', 1)
        ->where('questions.data.0.type', 'mcq')
    );
});

it('searches questions by text', function () {
    $topic = Topic::factory()->active()->create();
    Question::factory()->for($topic)->create(['text' => 'What is PHP?']);
    Question::factory()->for($topic)->create(['text' => 'What is Laravel?']);

    $response = $this->actingAs($this->admin)->get(
        route('admin.questions.index', ['search' => 'PHP']),
    );

    $response->assertInertia(fn ($page) => $page
        ->has('questions.data', 1)
    );
});

// ─── Create / Store ───────────────────────────────────────────

it('renders create page with active topics', function () {
    Topic::factory()->active()->create(['name' => 'Available']);
    Topic::factory()->inactive()->create(['name' => 'Hidden']);

    $response = $this->actingAs($this->admin)->get(route('admin.questions.create'));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/questions/create')
        ->has('topics', 1)
        ->where('topics.0.name', 'Available')
    );
});

it('stores an MCQ question with options', function () {
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.questions.store'), [
        'topic_id' => $topic->id,
        'type' => 'mcq',
        'text' => 'What is 2+2?',
        'difficulty' => 'easy',
        'is_active' => true,
        'options' => createMcqOptions(),
    ]);

    $response->assertRedirect(route('admin.questions.index'));

    $question = Question::where('text', 'What is 2+2?')->first();
    expect($question)->not->toBeNull();
    expect($question->options)->toHaveCount(3);
    expect($question->options->firstWhere('is_correct', true)->text)->toBe('Correct');
});

it('stores a true/false question', function () {
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.questions.store'), [
        'topic_id' => $topic->id,
        'type' => 'true_false',
        'text' => 'The sky is blue.',
        'difficulty' => 'easy',
        'options' => [
            ['text' => 'True', 'is_correct' => true],
            ['text' => 'False', 'is_correct' => false],
        ],
    ]);

    $response->assertRedirect(route('admin.questions.index'));

    expect(Question::where('text', 'The sky is blue.')->exists())->toBeTrue();
});

it('validates exactly one correct option', function () {
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.questions.store'), [
        'topic_id' => $topic->id,
        'type' => 'mcq',
        'text' => 'Test',
        'difficulty' => 'easy',
        'options' => [
            ['text' => 'A', 'is_correct' => false],
            ['text' => 'B', 'is_correct' => false],
        ],
    ]);

    $response->assertSessionHasErrors('options');
});

it('validates true_false has exactly two options', function () {
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.questions.store'), [
        'topic_id' => $topic->id,
        'type' => 'true_false',
        'text' => 'Test',
        'difficulty' => 'easy',
        'options' => [
            ['text' => 'True', 'is_correct' => true],
        ],
    ]);

    $response->assertSessionHasErrors('options');
});

it('validates topic_id must exist on store', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.questions.store'), [
        'topic_id' => 99999,
        'type' => 'mcq',
        'text' => 'Test',
        'difficulty' => 'easy',
        'options' => createMcqOptions(),
    ]);

    $response->assertSessionHasErrors('topic_id');
});

it('validates type must be mcq or true_false on store', function () {
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.questions.store'), [
        'topic_id' => $topic->id,
        'type' => 'essay',
        'text' => 'Test',
        'difficulty' => 'easy',
        'options' => createMcqOptions(),
    ]);

    $response->assertSessionHasErrors('type');
});

it('validates difficulty must be easy medium or hard on store', function () {
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.questions.store'), [
        'topic_id' => $topic->id,
        'type' => 'mcq',
        'text' => 'Test',
        'difficulty' => 'expert',
        'options' => createMcqOptions(),
    ]);

    $response->assertSessionHasErrors('difficulty');
});

it('validates options text is required on store', function () {
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.questions.store'), [
        'topic_id' => $topic->id,
        'type' => 'mcq',
        'text' => 'Test',
        'difficulty' => 'easy',
        'options' => [
            ['text' => '', 'is_correct' => true],
            ['text' => 'B', 'is_correct' => false],
        ],
    ]);

    $response->assertSessionHasErrors('options.0.text');
});

it('allows explanation to be null on store', function () {
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.questions.store'), [
        'topic_id' => $topic->id,
        'type' => 'mcq',
        'text' => 'No explanation question',
        'difficulty' => 'easy',
        'is_active' => true,
        'options' => createMcqOptions(),
    ]);

    $response->assertRedirect(route('admin.questions.index'));

    $question = Question::where('text', 'No explanation question')->first();
    expect($question->explanation)->toBeNull();
});

it('validates MCQ has at least two options', function () {
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.questions.store'), [
        'topic_id' => $topic->id,
        'type' => 'mcq',
        'text' => 'Test',
        'difficulty' => 'easy',
        'options' => [
            ['text' => 'Only', 'is_correct' => true],
        ],
    ]);

    $response->assertSessionHasErrors('options');
});

// ─── Show ─────────────────────────────────────────────────────

it('shows question with options and topic', function () {
    $topic = Topic::factory()->active()->create(['name' => 'Science']);
    $question = Question::factory()->for($topic)->create(['text' => 'Test question']);
    QuestionOption::factory()->for($question)->correct()->create(['text' => 'Right']);

    $response = $this->actingAs($this->admin)->get(route('admin.questions.show', $question));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/questions/show')
        ->where('question.text', 'Test question')
        ->has('question.options')
        ->where('question.topic.name', 'Science')
    );
});

// ─── Edit / Update ────────────────────────────────────────────

it('renders edit page with options and active topics', function () {
    $topic = Topic::factory()->active()->create();
    $question = Question::factory()->for($topic)->create();
    QuestionOption::factory()->for($question)->correct()->create();

    $response = $this->actingAs($this->admin)->get(route('admin.questions.edit', $question));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/questions/edit')
        ->where('question.id', $question->id)
        ->has('question.options')
        ->has('topics')
    );
});

it('updates question text and replaces options', function () {
    $topic = Topic::factory()->active()->create();
    $question = Question::factory()->for($topic)->create(['text' => 'Old text']);
    $oldOption = QuestionOption::factory()->for($question)->correct()->create();

    $response = $this->actingAs($this->admin)->put(route('admin.questions.update', $question), [
        'topic_id' => $topic->id,
        'type' => 'mcq',
        'text' => 'New text',
        'difficulty' => 'hard',
        'is_active' => true,
        'options' => [
            ['text' => 'New correct', 'is_correct' => true],
            ['text' => 'New wrong', 'is_correct' => false],
        ],
    ]);

    $response->assertRedirect(route('admin.questions.index'));

    $question->refresh();
    expect($question->text)->toBe('New text');
    expect($question->difficulty)->toBe('hard');
    expect($question->options)->toHaveCount(2);
    expect($question->options->firstWhere('is_correct', true)->text)->toBe('New correct');
    expect($oldOption->fresh())->toBeNull();
});

// ─── Destroy ──────────────────────────────────────────────────

it('deletes a question', function () {
    $topic = Topic::factory()->active()->create();
    $question = Question::factory()->for($topic)->create();

    $response = $this->actingAs($this->admin)->delete(route('admin.questions.destroy', $question));

    $response->assertRedirect(route('admin.questions.index'));

    expect(Question::find($question->id))->toBeNull();
});
