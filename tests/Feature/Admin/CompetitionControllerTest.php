<?php

use App\Models\Competition;
use App\Models\Topic;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

// ─── Index ────────────────────────────────────────────────────

it('lists competitions with stats', function () {
    Competition::factory()->standalone()->active()->create();
    Competition::factory()->container()->active()->create();

    $response = $this->actingAs($this->admin)->get(route('admin.competitions.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/competitions/index')
        ->has('competitions.data', 2)
        ->has('stats')
    );
});

it('searches competitions by name or code', function () {
    Competition::factory()->standalone()->create(['name' => 'Final Exam']);
    Competition::factory()->standalone()->create(['name' => 'Quiz']);

    $response = $this->actingAs($this->admin)->get(
        route('admin.competitions.index', ['search' => 'Final']),
    );

    $response->assertInertia(fn ($page) => $page
        ->has('competitions.data', 1)
        ->where('competitions.data.0.name', 'Final Exam')
    );
});

// ─── Create / Store ───────────────────────────────────────────

it('renders create page', function () {
    $response = $this->actingAs($this->admin)->get(route('admin.competitions.create'));

    $response->assertInertia(fn ($page) => $page->component('admin/competitions/create'));
});

it('stores a standalone competition', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.competitions.store'), [
        'classification' => 'standalone',
        'code' => 'FINAL-01',
        'name' => 'Final Exam',
        'description' => 'End of term',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.competitions.index'));

    $this->assertDatabaseHas('competitions', [
        'code' => 'FINAL-01',
        'classification' => 'standalone',
    ]);
});

it('stores a container competition', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.competitions.store'), [
        'classification' => 'container',
        'code' => 'CONTAINER',
        'name' => 'Main Container',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.competitions.index'));

    $this->assertDatabaseHas('competitions', [
        'code' => 'CONTAINER',
        'classification' => 'container',
    ]);
});

it('stores a child competition under a container', function () {
    $container = Competition::factory()->container()->active()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.competitions.store'), [
        'classification' => 'child',
        'parent_id' => $container->id,
        'code' => 'CHILD-01',
        'name' => 'Child Exam',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.competitions.index'));

    $this->assertDatabaseHas('competitions', [
        'code' => 'CHILD-01',
        'parent_id' => $container->id,
    ]);
});

it('validates container cannot have parent', function () {
    $parent = Competition::factory()->container()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.competitions.store'), [
        'classification' => 'container',
        'parent_id' => $parent->id,
        'code' => 'INVALID',
        'name' => 'Invalid',
    ]);

    $response->assertSessionHasErrors('parent_id');
});

it('validates child must have a parent', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.competitions.store'), [
        'classification' => 'child',
        'code' => 'NO-PARENT',
        'name' => 'Orphan',
    ]);

    $response->assertSessionHasErrors('parent_id');
});

it('validates parent must be a container', function () {
    $standalone = Competition::factory()->standalone()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.competitions.store'), [
        'classification' => 'child',
        'parent_id' => $standalone->id,
        'code' => 'BAD-PARENT',
        'name' => 'Bad',
    ]);

    $response->assertSessionHasErrors('parent_id');
});

it('validates code uniqueness on store', function () {
    Competition::factory()->standalone()->create(['code' => 'DUPLICATE']);

    $response = $this->actingAs($this->admin)->post(route('admin.competitions.store'), [
        'classification' => 'standalone',
        'code' => 'DUPLICATE',
        'name' => 'Duplicate',
    ]);

    $response->assertSessionHasErrors('code');
});

it('allows updating competition with same code', function () {
    $competition = Competition::factory()->standalone()->create(['code' => 'SAME-CODE']);

    $response = $this->actingAs($this->admin)->put(route('admin.competitions.update', $competition), [
        'classification' => 'standalone',
        'code' => 'SAME-CODE',
        'name' => 'Updated',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.competitions.index'));
});

it('validates classification must be a valid type on store', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.competitions.store'), [
        'classification' => 'invalid_type',
        'code' => 'INVALID',
        'name' => 'Invalid',
    ]);

    $response->assertSessionHasErrors('classification');
});

// ─── Show ─────────────────────────────────────────────────────

it('shows competition with parent and children', function () {
    $container = Competition::factory()->container()->create(['name' => 'Root']);
    Competition::factory()->child()->create(['parent_id' => $container->id, 'name' => 'Child']);

    $response = $this->actingAs($this->admin)->get(route('admin.competitions.show', $container));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/competitions/show')
        ->where('competition.name', 'Root')
        ->has('competition.children', 1)
    );
});

// ─── Edit / Update ────────────────────────────────────────────

it('renders edit page', function () {
    $competition = Competition::factory()->standalone()->create();

    $response = $this->actingAs($this->admin)->get(route('admin.competitions.edit', $competition));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/competitions/edit')
        ->where('competition.id', $competition->id)
    );
});

it('updates a competition', function () {
    $competition = Competition::factory()->standalone()->create(['name' => 'Old']);

    $response = $this->actingAs($this->admin)->put(route('admin.competitions.update', $competition), [
        'classification' => 'standalone',
        'code' => $competition->code,
        'name' => 'Updated',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.competitions.index'));

    $competition->refresh();
    expect($competition->name)->toBe('Updated');
});

it('prevents removing container classification when children exist', function () {
    $container = Competition::factory()->container()->create();
    Competition::factory()->child()->create(['parent_id' => $container->id]);

    $response = $this->actingAs($this->admin)->put(route('admin.competitions.update', $container), [
        'classification' => 'standalone',
        'code' => $container->code,
        'name' => $container->name,
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors('classification');
});

// ─── Destroy ──────────────────────────────────────────────────

it('deletes a competition with no children', function () {
    $competition = Competition::factory()->standalone()->create();

    $response = $this->actingAs($this->admin)->delete(route('admin.competitions.destroy', $competition));

    $response->assertRedirect(route('admin.competitions.index'));

    expect(Competition::find($competition->id))->toBeNull();
});

it('prevents deleting a competition with children', function () {
    $container = Competition::factory()->container()->create();
    Competition::factory()->child()->create(['parent_id' => $container->id]);

    $response = $this->actingAs($this->admin)->delete(route('admin.competitions.destroy', $container));

    $response->assertRedirect();
    $response->assertSessionHas('error');

    expect(Competition::find($container->id))->not->toBeNull();
});

// ─── Topics Sync ──────────────────────────────────────────────

it('renders topics edit page for non-container competitions', function () {
    $competition = Competition::factory()->standalone()->create();

    $response = $this->actingAs($this->admin)->get(
        route('admin.competitions.topics.edit', $competition),
    );

    $response->assertInertia(fn ($page) => $page->component('admin/competitions/topics'));
});

it('prevents topic editing for container competitions', function () {
    $container = Competition::factory()->container()->create();

    $response = $this->actingAs($this->admin)->get(
        route('admin.competitions.topics.edit', $container),
    );

    $response->assertForbidden();
});

it('syncs topics to a competition', function () {
    $competition = Competition::factory()->standalone()->create();
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->put(
        route('admin.competitions.topics.sync', $competition),
        [
            'topics' => [
                ['topic_id' => $topic->id, 'questions_count' => 10, 'duration_minutes' => 30],
            ],
        ],
    );

    $response->assertRedirect();

    expect($competition->topics)->toHaveCount(1);
    $pivot = $competition->topics->first()->pivot;
    expect($pivot->questions_count)->toBe(10);
    expect($pivot->duration_minutes)->toBe(30);
});

it('prevents syncing topics to a container', function () {
    $container = Competition::factory()->container()->create();
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->put(
        route('admin.competitions.topics.sync', $container),
        [
            'topics' => [
                ['topic_id' => $topic->id, 'questions_count' => 5, 'duration_minutes' => 15],
            ],
        ],
    );

    $response->assertSessionHasErrors('topics');
});

it('validates topic_id must exist on sync', function () {
    $competition = Competition::factory()->standalone()->create();

    $response = $this->actingAs($this->admin)->put(
        route('admin.competitions.topics.sync', $competition),
        [
            'topics' => [
                ['topic_id' => 99999, 'questions_count' => 5, 'duration_minutes' => 15],
            ],
        ],
    );

    $response->assertSessionHasErrors('topics.0.topic_id');
});

it('validates questions_count minimum on sync', function () {
    $competition = Competition::factory()->standalone()->create();
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->put(
        route('admin.competitions.topics.sync', $competition),
        [
            'topics' => [
                ['topic_id' => $topic->id, 'questions_count' => 0, 'duration_minutes' => 15],
            ],
        ],
    );

    $response->assertSessionHasErrors('topics.0.questions_count');
});

it('validates duration_minutes minimum on sync', function () {
    $competition = Competition::factory()->standalone()->create();
    $topic = Topic::factory()->active()->create();

    $response = $this->actingAs($this->admin)->put(
        route('admin.competitions.topics.sync', $competition),
        [
            'topics' => [
                ['topic_id' => $topic->id, 'questions_count' => 5, 'duration_minutes' => 0],
            ],
        ],
    );

    $response->assertSessionHasErrors('topics.0.duration_minutes');
});
