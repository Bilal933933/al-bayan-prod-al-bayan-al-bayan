<?php

use App\Models\Attempt;
use App\Models\Competition;
use App\Models\Topic;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'student']);
});

// ─── Index ────────────────────────────────────────────────────

it('guest cannot access competitions index', function () {
    $response = $this->get(route('student.competitions.index'));

    $response->assertRedirect(route('login'));
});

it('shows empty state when no competitions exist', function () {
    $response = $this->actingAs($this->user)->get(route('student.competitions.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('student/competitions/index')
        ->where('competitions', [])
    );
});

it('lists only active competitions', function () {
    Competition::factory()->active()->standalone()->create(['name' => 'Active A']);
    Competition::factory()->active()->standalone()->create(['name' => 'Active B']);
    Competition::factory()->inactive()->standalone()->create(['name' => 'Inactive C']);

    $response = $this->actingAs($this->user)->get(route('student.competitions.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('competitions', 2)
    );
});

it('default index shows only root competitions (no parent)', function () {
    $container = Competition::factory()->container()->active()->create(['name' => 'Root Container']);
    Competition::factory()->child()->active()->create(['parent_id' => $container->id, 'name' => 'Child']);

    $response = $this->actingAs($this->user)->get(route('student.competitions.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('competitions', 1)
        ->where('competitions.0.name', 'Root Container')
    );
});

it('filters by classification when query parameter provided', function () {
    Competition::factory()->standalone()->active()->create(['name' => 'Standalone']);
    $container = Competition::factory()->container()->active()->create(['name' => 'Container']);
    Competition::factory()->child()->active()->create(['parent_id' => $container->id, 'name' => 'Child']);

    $response = $this->actingAs($this->user)->get(
        route('student.competitions.index', ['classification' => 'standalone'])
    );

    $response->assertInertia(fn ($page) => $page
        ->has('competitions', 1)
        ->where('competitions.0.name', 'Standalone')
    );
});

it('ignores invalid classification filter', function () {
    Competition::factory()->standalone()->active()->create(['name' => 'Standalone']);
    $container = Competition::factory()->container()->active()->create(['name' => 'Container']);

    $response = $this->actingAs($this->user)->get(
        route('student.competitions.index', ['classification' => 'invalid'])
    );

    $response->assertInertia(fn ($page) => $page
        ->has('competitions', 2)
    );
});

it('includes children_count for root competitions', function () {
    $container = Competition::factory()->container()->active()->create();
    Competition::factory()->child()->active()->create(['parent_id' => $container->id]);
    Competition::factory()->child()->active()->create(['parent_id' => $container->id]);

    $response = $this->actingAs($this->user)->get(route('student.competitions.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('competitions.0.children_count', 2)
    );
});

it('preserves classification filter in response', function () {
    Competition::factory()->standalone()->active()->create();

    $response = $this->actingAs($this->user)->get(
        route('student.competitions.index', ['classification' => 'child'])
    );

    $response->assertInertia(fn ($page) => $page
        ->where('filters.classification', 'child')
    );
});

it('filters classification is null when not provided', function () {
    Competition::factory()->standalone()->active()->create();

    $response = $this->actingAs($this->user)->get(route('student.competitions.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('filters.classification', null)
    );
});

it('orders competitions by the order field', function () {
    Competition::factory()->standalone()->active()->create(['order' => 2, 'name' => 'B']);
    Competition::factory()->standalone()->active()->create(['order' => 1, 'name' => 'A']);

    $response = $this->actingAs($this->user)->get(route('student.competitions.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('competitions.0.name', 'A')
        ->where('competitions.1.name', 'B')
    );
});

// ─── Show ─────────────────────────────────────────────────────

it('guest cannot access competition show', function () {
    $competition = Competition::factory()->standalone()->active()->create();

    $response = $this->get(route('student.competitions.show', $competition));

    $response->assertRedirect(route('login'));
});

it('returns 404 for inactive competition', function () {
    $competition = Competition::factory()->inactive()->create();

    $response = $this->actingAs($this->user)->get(route('student.competitions.show', $competition));

    $response->assertNotFound();
});

it('shows container competition with children', function () {
    $container = Competition::factory()->container()->active()->create(['name' => 'Main']);
    Competition::factory()->child()->active()->create(['parent_id' => $container->id, 'name' => 'Child A']);
    Competition::factory()->child()->active()->create(['parent_id' => $container->id, 'name' => 'Child B']);

    $response = $this->actingAs($this->user)->get(route('student.competitions.show', $container));

    $response->assertInertia(fn ($page) => $page
        ->component('student/competitions/show')
        ->where('competition.name', 'Main')
        ->has('children', 2)
        ->where('children.0.name', 'Child A')
        ->where('children.1.name', 'Child B')
        ->where('topics', collect())
    );
});

it('container excludes inactive children', function () {
    $container = Competition::factory()->container()->active()->create();
    Competition::factory()->child()->active()->create(['parent_id' => $container->id, 'name' => 'Active Child']);
    Competition::factory()->child()->inactive()->create(['parent_id' => $container->id]);

    $response = $this->actingAs($this->user)->get(route('student.competitions.show', $container));

    $response->assertInertia(fn ($page) => $page
        ->has('children', 1)
        ->where('children.0.name', 'Active Child')
    );
});

it('shows standalone competition with topics', function () {
    $competition = Competition::factory()->standalone()->active()->create(['name' => 'Final Exam']);
    $topic = Topic::factory()->active()->create(['name' => 'Physics']);
    $competition->topics()->attach($topic, [
        'questions_count' => 10, 'duration_minutes' => 30, 'difficulty_distribution' => null,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.competitions.show', $competition));

    $response->assertInertia(fn ($page) => $page
        ->has('topics', 1)
        ->where('topics.0.name', 'Physics')
        ->where('children', collect())
    );
});

it('standalone includes user attempt stats per topic', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, [
        'questions_count' => 10, 'duration_minutes' => 30, 'difficulty_distribution' => null,
    ]);

    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_EXAM,
        'competition_id' => $competition->id, 'topic_id' => $topic->id,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(), 'finished_at' => now(),
        'total_questions' => 10, 'correct_answers' => 8,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.competitions.show', $competition));

    $response->assertInertia(fn ($page) => $page
        ->where('topics.0.user_attempts_count', 1)
        ->where('topics.0.best_score.correct', 8)
        ->where('topics.0.best_score.total', 10)
    );
});

it('standalone shows in_progress attempt state', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, [
        'questions_count' => 10, 'duration_minutes' => 30, 'difficulty_distribution' => null,
    ]);

    $attempt = Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_EXAM,
        'competition_id' => $competition->id, 'topic_id' => $topic->id,
        'status' => Attempt::STATUS_IN_PROGRESS, 'started_at' => now(),
    ]);

    $response = $this->actingAs($this->user)->get(route('student.competitions.show', $competition));

    $response->assertInertia(fn ($page) => $page
        ->where('topics.0.has_in_progress', true)
        ->where('topics.0.in_progress_attempt_id', $attempt->id)
    );
});

it('standalone ignores practice attempts in stats', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, [
        'questions_count' => 10, 'duration_minutes' => 30, 'difficulty_distribution' => null,
    ]);

    Attempt::create([
        'user_id' => $this->user->id, 'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(), 'finished_at' => now(),
        'total_questions' => 10, 'correct_answers' => 8,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.competitions.show', $competition));

    $response->assertInertia(fn ($page) => $page
        ->where('topics.0.user_attempts_count', 0)
        ->where('topics.0.best_score', null)
    );
});

it('standalone excludes inactive topics', function () {
    $competition = Competition::factory()->standalone()->active()->create();
    $activeTopic = Topic::factory()->active()->create(['name' => 'Active']);
    $inactiveTopic = Topic::factory()->inactive()->create(['name' => 'Inactive']);
    $competition->topics()->attach([$activeTopic->id, $inactiveTopic->id], [
        'questions_count' => 5, 'duration_minutes' => 10, 'difficulty_distribution' => null,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.competitions.show', $competition));

    $response->assertInertia(fn ($page) => $page
        ->has('topics', 1)
        ->where('topics.0.name', 'Active')
    );
});
