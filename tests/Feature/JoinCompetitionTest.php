<?php

use App\Models\Attempt;
use App\Models\Competition;
use App\Models\Question;
use App\Models\Topic;
use App\Models\User;
use App\Services\AttemptCreationService;
use Illuminate\Support\Carbon;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\mock;

// ─── Helpers ──────────────────────────────────────────────────

function createStudent(): User
{
    return User::factory()->create(['role' => 'student']);
}

function createCompetitionWithTopics(): Competition
{
    $competition = Competition::factory()->standalone()->active()->create();
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, [
        'questions_count' => 2,
        'duration_minutes' => 10,
        'difficulty_distribution' => null,
    ]);
    Question::factory(2)->active()->for($topic)->create();

    return $competition;
}

// ─── Index — صفحة الانضمام ────────────────────────────────────

describe('join page (index)', function () {

    it('يعرض صفحة الانضمام للمسابقة المستقلة', function () {
        $competition = Competition::factory()->standalone()->active()->create();

        actingAs(createStudent())
            ->get(route('student.competitions.join', $competition))
            ->assertOk();
    });

    it('يعرض صفحة الانضمام للمسابقة الفرعية', function () {
        $container = Competition::factory()->container()->active()->create();
        $child = Competition::factory()->child()->active()->create(['parent_id' => $container->id]);

        actingAs(createStudent())
            ->get(route('student.competitions.join', $child))
            ->assertOk();
    });

    it('يعيد التوجيه إلى العرض إذا كان منضماً بالفعل', function () {
        $competition = Competition::factory()->standalone()->active()->create();
        $user = createStudent();
        $user->competitions()->attach($competition, ['joined_at' => now()]);

        actingAs($user)
            ->get(route('student.competitions.join', $competition))
            ->assertRedirect(route('student.competitions.show', $competition));
    });

    it('يعيد 404 للمسابقة غير النشطة', function () {
        $competition = Competition::factory()->standalone()->inactive()->create();

        actingAs(createStudent())
            ->get(route('student.competitions.join', $competition))
            ->assertNotFound();
    });

});

// ─── Store — الانضمام ─────────────────────────────────────────

describe('join action (store)', function () {

    it('ينضم إلى مسابقة مستقلة', function () {
        $competition = Competition::factory()->standalone()->active()->create();
        $user = createStudent();

        actingAs($user)
            ->post(route('student.competitions.join.store', $competition))
            ->assertRedirect(route('student.competitions.show', $competition));

        expect($user->competitions()->where('competition_id', $competition->id)->exists())->toBeTrue();
    });

    it('ينضم لفرعية عبر الحاوية (Container-Aware)', function () {
        $container = Competition::factory()->container()->active()->create();
        $child = Competition::factory()->child()->active()->create(['parent_id' => $container->id]);
        $user = createStudent();

        actingAs($user)
            ->post(route('student.competitions.join.store', $child))
            ->assertRedirect(route('student.competitions.show', $child));

        expect($user->competitions()->where('competition_id', $container->id)->exists())->toBeTrue();
        expect($user->competitions()->where('competition_id', $child->id)->exists())->toBeFalse();
    });

    it('يمنع الانضمام للحاوية مباشرة', function () {
        $container = Competition::factory()->container()->active()->create();

        actingAs(createStudent())
            ->post(route('student.competitions.join.store', $container))
            ->assertForbidden();
    });

    it('يمنع الانضمام قبل تاريخ البداية', function () {
        $competition = Competition::factory()->standalone()->active()->create([
            'start_date' => Carbon::tomorrow()->addDay(),
        ]);

        actingAs(createStudent())
            ->post(route('student.competitions.join.store', $competition))
            ->assertForbidden();
    });

    it('يمنع الانضمام بعد تاريخ النهاية', function () {
        $competition = Competition::factory()->standalone()->active()->create([
            'end_date' => Carbon::yesterday(),
        ]);

        actingAs(createStudent())
            ->post(route('student.competitions.join.store', $competition))
            ->assertForbidden();
    });

    it('يسمح بالانضمام بدون تواريخ', function () {
        $competition = Competition::factory()->standalone()->active()->create();
        $user = createStudent();

        actingAs($user)
            ->post(route('student.competitions.join.store', $competition))
            ->assertRedirect(route('student.competitions.show', $competition));

        expect($user->competitions()->where('competition_id', $competition->id)->exists())->toBeTrue();
    });

    it('يسمح بالانضمام خلال الفترة النشطة', function () {
        $competition = Competition::factory()->standalone()->active()->create([
            'start_date' => Carbon::yesterday(),
            'end_date' => Carbon::tomorrow(),
        ]);
        $user = createStudent();

        actingAs($user)
            ->post(route('student.competitions.join.store', $competition))
            ->assertRedirect(route('student.competitions.show', $competition));

        expect($user->competitions()->where('competition_id', $competition->id)->exists())->toBeTrue();
    });

    it('syncWithoutDetaching لا يكرر الانضمام', function () {
        $competition = Competition::factory()->standalone()->active()->create();
        $user = createStudent();

        actingAs($user)->post(route('student.competitions.join.store', $competition));
        actingAs($user)->post(route('student.competitions.join.store', $competition));

        expect($user->competitions()->count())->toBe(1);
    });

});

// ─── StartExam — بدء الاختبار ─────────────────────────────────

describe('start exam enrollment check', function () {

    beforeEach(function () {
        $this->mockAttempt = new Attempt;
        $this->mockAttempt->id = 9999;

        mock(AttemptCreationService::class)
            ->shouldReceive('createExam')
            ->andReturn($this->mockAttempt);
    });

    it('يمنع البدء بدون انضمام', function () {
        $competition = createCompetitionWithTopics();

        actingAs(createStudent())
            ->post(route('student.competitions.attempts.start', $competition))
            ->assertForbidden();
    });

    it('يمنع البدء للحاوية', function () {
        $container = Competition::factory()->container()->active()->create();

        actingAs(createStudent())
            ->post(route('student.competitions.attempts.start', $container))
            ->assertForbidden();
    });

    it('يمنع البدء إذا كانت المسابقة قادمة', function () {
        $competition = Competition::factory()->standalone()->active()->create([
            'start_date' => Carbon::tomorrow()->addDay(),
        ]);

        actingAs(createStudent())
            ->post(route('student.competitions.attempts.start', $competition))
            ->assertForbidden();
    });

    it('يمنع البدء إذا كانت المسابقة منتهية', function () {
        $competition = Competition::factory()->standalone()->active()->create([
            'end_date' => Carbon::yesterday(),
        ]);

        actingAs(createStudent())
            ->post(route('student.competitions.attempts.start', $competition))
            ->assertForbidden();
    });

    it('يسمح بالبدء إذا كان منضماً والمسابقة نشطة', function () {
        $competition = createCompetitionWithTopics();
        $user = createStudent();
        $user->competitions()->attach($competition, ['joined_at' => now()]);

        actingAs($user)
            ->post(route('student.competitions.attempts.start', $competition))
            ->assertFound();
    });

    it('Container-Aware: الانضمام للحاوية يسمح بالبدء في الفرعية', function () {
        $container = Competition::factory()->container()->active()->create();
        $child = createCompetitionWithTopics();
        $child->update(['parent_id' => $container->id, 'classification' => 'child']);
        $user = createStudent();
        $user->competitions()->attach($container, ['joined_at' => now()]);

        actingAs($user)
            ->post(route('student.competitions.attempts.start', $child))
            ->assertFound();
    });

});
