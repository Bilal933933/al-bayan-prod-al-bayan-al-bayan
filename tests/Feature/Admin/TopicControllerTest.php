<?php

use App\Models\Competition;
use App\Models\Topic;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

// ─── Index ────────────────────────────────────────────────────

it('lists all topics with stats', function () {
    Topic::factory()->active()->general()->create(['name' => 'A']);
    Topic::factory()->inactive()->private()->create(['name' => 'B']);

    $response = $this->actingAs($this->admin)->get(route('admin.topics.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/topics/index')
        ->has('topics.data', 2)
        ->where('stats.total', 2)
        ->where('stats.active', 1)
        ->where('stats.general', 1)
        ->where('stats.private_', 1)
    );
});

it('filters topics by search', function () {
    Topic::factory()->create(['name' => 'Mathematics']);
    Topic::factory()->create(['name' => 'Physics']);

    $response = $this->actingAs($this->admin)->get(
        route('admin.topics.index', ['search' => 'Math']),
    );

    $response->assertInertia(fn ($page) => $page
        ->has('topics.data', 1)
        ->where('topics.data.0.name', 'Mathematics')
    );
});

it('filters topics by visibility', function () {
    Topic::factory()->general()->create(['name' => 'Public']);
    Topic::factory()->private()->create(['name' => 'Private']);

    $response = $this->actingAs($this->admin)->get(
        route('admin.topics.index', ['filter' => 'general']),
    );

    $response->assertInertia(fn ($page) => $page
        ->has('topics.data', 1)
        ->where('topics.data.0.name', 'Public')
    );
});

it('sorts topics by name ascending', function () {
    Topic::factory()->create(['name' => 'B']);
    Topic::factory()->create(['name' => 'A']);

    $response = $this->actingAs($this->admin)->get(
        route('admin.topics.index', ['sort' => 'name', 'direction' => 'asc']),
    );

    $response->assertInertia(fn ($page) => $page
        ->where('topics.data.0.name', 'A')
        ->where('topics.data.1.name', 'B')
    );
});

it('includes competitions_count', function () {
    $topic = Topic::factory()->create();
    $competition = Competition::factory()->standalone()->create();
    $competition->topics()->attach($topic, [
        'questions_count' => 5, 'duration_minutes' => 10, 'difficulty_distribution' => null,
    ]);

    $response = $this->actingAs($this->admin)->get(route('admin.topics.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('topics.data.0.competitions_count', 1)
    );
});

// ─── Create / Store ───────────────────────────────────────────

it('renders create page', function () {
    $response = $this->actingAs($this->admin)->get(route('admin.topics.create'));

    $response->assertInertia(fn ($page) => $page->component('admin/topics/create'));
});

it('validates code must be string on store', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.topics.store'), [
        'code' => ['not-a-string'],
        'name' => 'Test',
        'visibility' => 'general',
        'default_questions_count' => 5,
    ]);

    $response->assertSessionHasErrors('code');
});

it('validates visibility must be general or private on store', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.topics.store'), [
        'code' => 'INVALID-VIS',
        'name' => 'Test',
        'visibility' => 'public',
        'default_questions_count' => 5,
    ]);

    $response->assertSessionHasErrors('visibility');
});

it('allows description to be null on store', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.topics.store'), [
        'code' => 'NO-DESC',
        'name' => 'No Description',
        'visibility' => 'general',
        'default_questions_count' => 5,
    ]);

    $response->assertRedirect(route('admin.topics.index'));

    $this->assertDatabaseHas('topics', ['code' => 'NO-DESC', 'description' => null]);
});

it('allows default_duration_minutes to be null on store', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.topics.store'), [
        'code' => 'NO-DUR',
        'name' => 'No Duration',
        'visibility' => 'general',
        'default_questions_count' => 5,
    ]);

    $response->assertRedirect(route('admin.topics.index'));

    $this->assertDatabaseHas('topics', ['code' => 'NO-DUR', 'default_duration_minutes' => null]);
});

it('allows setting is_active to false on store', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.topics.store'), [
        'code' => 'INACTIVE',
        'name' => 'Inactive',
        'visibility' => 'general',
        'default_questions_count' => 5,
        'is_active' => false,
    ]);

    $topic = Topic::where('code', 'INACTIVE')->first();
    expect($topic->is_active)->toBeFalse();
});

it('stores a new topic', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.topics.store'), [
        'code' => 'MATH-101',
        'name' => 'Mathematics',
        'visibility' => 'general',
        'description' => 'Basic math',
        'default_questions_count' => 10,
        'default_duration_minutes' => 30,
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.topics.index'));

    $this->assertDatabaseHas('topics', [
        'code' => 'MATH-101',
        'name' => 'Mathematics',
        'visibility' => 'general',
    ]);
});

it('validates required fields on store', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.topics.store'), []);

    $response->assertSessionHasErrors(['code', 'name', 'visibility', 'default_questions_count']);
});

it('validates unique code on store', function () {
    Topic::factory()->create(['code' => 'EXISTING']);

    $response = $this->actingAs($this->admin)->post(route('admin.topics.store'), [
        'code' => 'EXISTING',
        'name' => 'Test',
        'visibility' => 'general',
        'default_questions_count' => 5,
    ]);

    $response->assertSessionHasErrors('code');
});

// ─── Show ─────────────────────────────────────────────────────

it('shows topic with competitions', function () {
    $topic = Topic::factory()->create(['name' => 'Algebra']);
    $competition = Competition::factory()->standalone()->create();
    $competition->topics()->attach($topic, [
        'questions_count' => 5, 'duration_minutes' => 10, 'difficulty_distribution' => null,
    ]);

    $response = $this->actingAs($this->admin)->get(route('admin.topics.show', $topic));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/topics/show')
        ->where('topic.name', 'Algebra')
        ->has('topic.competitions', 1)
    );
});

// ─── Edit / Update ────────────────────────────────────────────

it('renders edit page', function () {
    $topic = Topic::factory()->create();

    $response = $this->actingAs($this->admin)->get(route('admin.topics.edit', $topic));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/topics/edit')
        ->where('topic.id', $topic->id)
    );
});

it('validates default_questions_count must be at least 1 on update', function () {
    $topic = Topic::factory()->create();

    $response = $this->actingAs($this->admin)->put(route('admin.topics.update', $topic), [
        'code' => $topic->code,
        'name' => 'Test',
        'visibility' => 'general',
        'default_questions_count' => 0,
    ]);

    $response->assertSessionHasErrors('default_questions_count');
});

it('updates a topic', function () {
    $topic = Topic::factory()->create(['name' => 'Old Name']);

    $response = $this->actingAs($this->admin)->put(route('admin.topics.update', $topic), [
        'code' => $topic->code,
        'name' => 'New Name',
        'visibility' => 'private',
        'default_questions_count' => 15,
    ]);

    $response->assertRedirect(route('admin.topics.index'));

    $topic->refresh();
    expect($topic->name)->toBe('New Name');
    expect($topic->visibility)->toBe('private');
});

it('validates unique code excluding current topic on update', function () {
    $topic = Topic::factory()->create(['code' => 'ORIGINAL']);
    Topic::factory()->create(['code' => 'OTHER']);

    $response = $this->actingAs($this->admin)->put(route('admin.topics.update', $topic), [
        'code' => 'OTHER',
        'name' => 'Test',
        'visibility' => 'general',
        'default_questions_count' => 5,
    ]);

    $response->assertSessionHasErrors('code');
});

// ─── Destroy ──────────────────────────────────────────────────

it('deletes a topic with no competitions', function () {
    $topic = Topic::factory()->create();

    $response = $this->actingAs($this->admin)->delete(route('admin.topics.destroy', $topic));

    $response->assertRedirect(route('admin.topics.index'));

    expect(Topic::find($topic->id))->toBeNull();
});

it('prevents deleting a topic linked to competitions', function () {
    $topic = Topic::factory()->create();
    $competition = Competition::factory()->standalone()->create();
    $competition->topics()->attach($topic, [
        'questions_count' => 5, 'duration_minutes' => 10, 'difficulty_distribution' => null,
    ]);

    $response = $this->actingAs($this->admin)->delete(route('admin.topics.destroy', $topic));

    $response->assertRedirect();
    $response->assertSessionHas('error');

    expect(Topic::find($topic->id))->not->toBeNull();
});
