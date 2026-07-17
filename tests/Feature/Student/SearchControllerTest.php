<?php

use App\Models\Competition;
use App\Models\Topic;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'student']);
});

// ─── Auth ─────────────────────────────────────────────────────

it('guest cannot search', function () {
    $response = $this->get(route('student.search', ['q' => 'math']));

    $response->assertRedirect(route('login'));
});

// ─── Validation ───────────────────────────────────────────────

it('returns empty when query is too short', function () {
    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'a']),
    );

    $response->assertOk()
        ->assertExactJson(['topics' => [], 'competitions' => []]);
});

it('returns empty when query is empty', function () {
    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => '']),
    );

    $response->assertOk()
        ->assertExactJson(['topics' => [], 'competitions' => []]);
});

// ─── Topic search ─────────────────────────────────────────────

it('finds topics by name', function () {
    Topic::factory()->active()->create(['name' => 'Advanced Calculus']);
    Topic::factory()->active()->create(['name' => 'Basic Algebra']);

    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'Calculus']),
    );

    $response->assertOk()
        ->assertJsonCount(1, 'topics')
        ->assertJsonPath('topics.0.name', 'Advanced Calculus');
});

it('finds topics by code', function () {
    Topic::factory()->active()->create(['code' => 'MATH-101', 'name' => 'Intro']);
    Topic::factory()->active()->create(['code' => 'PHY-201', 'name' => 'Physics']);

    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'MATH']),
    );

    $response->assertOk()
        ->assertJsonCount(1, 'topics')
        ->assertJsonPath('topics.0.code', 'MATH-101');
});

it('does not include inactive topics in search', function () {
    Topic::factory()->active()->create(['name' => 'Active Topic']);
    Topic::factory()->inactive()->create(['name' => 'Hidden Topic']);

    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'Topic']),
    );

    $response->assertOk()
        ->assertJsonCount(1, 'topics')
        ->assertJsonPath('topics.0.name', 'Active Topic');
});

it('topic result includes id, code and name', function () {
    Topic::factory()->active()->create([
        'code' => 'ALG-001',
        'name' => 'Algebra',
    ]);

    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'Algebra']),
    );

    $response->assertOk()
        ->assertJsonCount(1, 'topics')
        ->assertJsonStructure([
            'topics' => [['id', 'code', 'name']],
            'competitions' => [],
        ]);
});

// ─── Competition search ───────────────────────────────────────

it('finds competitions by name', function () {
    Competition::factory()->active()->standalone()->create(['name' => 'Math Olympiad']);
    Competition::factory()->active()->standalone()->create(['name' => 'Science Fair']);

    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'Olympiad']),
    );

    $response->assertOk()
        ->assertJsonCount(1, 'competitions')
        ->assertJsonPath('competitions.0.name', 'Math Olympiad');
});

it('finds competitions by code', function () {
    Competition::factory()->active()->standalone()->create(['code' => 'OLYMP-2026', 'name' => 'Olympiad']);
    Competition::factory()->active()->standalone()->create(['code' => 'SCI-2026', 'name' => 'Science']);

    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'OLYMP']),
    );

    $response->assertOk()
        ->assertJsonCount(1, 'competitions')
        ->assertJsonPath('competitions.0.code', 'OLYMP-2026');
});

it('does not include inactive competitions in search', function () {
    Competition::factory()->active()->standalone()->create(['name' => 'Active Comp']);
    Competition::factory()->inactive()->standalone()->create(['name' => 'Inactive Comp']);

    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'Comp']),
    );

    $response->assertOk()
        ->assertJsonCount(1, 'competitions')
        ->assertJsonPath('competitions.0.name', 'Active Comp');
});

it('competition result includes id, code, name and slug', function () {
    Competition::factory()->active()->standalone()->create([
        'code' => 'FINAL-01',
        'name' => 'Final Exam',
        'slug' => 'final-exam-2026',
    ]);

    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'Final']),
    );

    $response->assertOk()
        ->assertJsonCount(1, 'competitions')
        ->assertJsonStructure([
            'topics' => [],
            'competitions' => [['id', 'code', 'name', 'slug']],
        ]);
});

// ─── Combined results ─────────────────────────────────────────

it('returns both topics and competitions matching the query', function () {
    Topic::factory()->active()->create(['name' => 'Math Topics']);
    Competition::factory()->active()->standalone()->create(['name' => 'Math Competition']);

    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'Math']),
    );

    $response->assertOk()
        ->assertJsonCount(1, 'topics')
        ->assertJsonCount(1, 'competitions');
});

// ─── Arabic search ────────────────────────────────────────────

it('finds topics with Arabic names', function () {
    Topic::factory()->active()->create(['name' => 'اللغة العربية']);
    Topic::factory()->active()->create(['name' => 'الرياضيات']);

    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'اللغة']),
    );

    $response->assertOk()
        ->assertJsonCount(1, 'topics')
        ->assertJsonPath('topics.0.name', 'اللغة العربية');
});

it('finds competitions with Arabic names', function () {
    Competition::factory()->active()->standalone()->create(['name' => 'مسابقة القرآن الكريم']);
    Competition::factory()->active()->standalone()->create(['name' => 'مسابقة الفيزياء']);

    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'القرآن']),
    );

    $response->assertOk()
        ->assertJsonCount(1, 'competitions')
        ->assertJsonPath('competitions.0.name', 'مسابقة القرآن الكريم');
});

// ─── No matches ───────────────────────────────────────────────

it('returns empty arrays when no matches found', function () {
    $response = $this->actingAs($this->user)->getJson(
        route('student.search', ['q' => 'zzzzz']),
    );

    $response->assertOk()
        ->assertExactJson(['topics' => [], 'competitions' => []]);
});
