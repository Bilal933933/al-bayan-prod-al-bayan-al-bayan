<?php

use App\Models\Attempt;
use App\Models\Competition;
use App\Models\Topic;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'student']);
});

// ─── Auth ─────────────────────────────────────────────────────

it('guest cannot access results', function () {
    $response = $this->get(route('student.results.index'));

    $response->assertRedirect(route('login'));
});

it('other users cannot access another user results', function () {
    $other = User::factory()->create(['role' => 'student']);
    Attempt::create([
        'user_id' => $other->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(),
        'finished_at' => now(),
        'total_questions' => 10,
        'correct_answers' => 9,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('overallStats.total_attempts', 0)
        ->where('evaluation.level', 'no_data')
    );
});

// ─── Empty State ──────────────────────────────────────────────

it('returns empty stats when user has no attempts', function () {
    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('student/results/index')
        ->where('overallStats', [
            'total_attempts' => 0,
            'completed_count' => 0,
            'in_progress_count' => 0,
            'average_percentage' => null,
            'best_score' => 0,
            'total_seconds' => 0,
        ])
        ->where('evaluation.level', 'no_data')
        ->where('topicBreakdown', [])
        ->where('competitionBreakdown', [])
        ->where('recentResults', [])
        ->where('progress', [])
    );
});

// ─── Overall Stats ───────────────────────────────────────────

it('calculates overall stats across mixed statuses', function () {
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(),
        'finished_at' => now(),
        'total_questions' => 10,
        'correct_answers' => 8,
    ]);
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_EXAM,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHours(2),
        'finished_at' => now()->subHour(),
        'total_questions' => 20,
        'correct_answers' => 15,
    ]);
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_IN_PROGRESS,
        'started_at' => now(),
    ]);
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_EXAM,
        'status' => Attempt::STATUS_ABANDONED,
        'started_at' => now()->subDays(1),
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('overallStats.total_attempts', 4)
        ->where('overallStats.completed_count', 2)
        ->where('overallStats.in_progress_count', 1)
        ->where('overallStats.average_percentage', 77)
        ->where('overallStats.best_score', 15)
    );
});

it('returns best score as highest correct_answers', function () {
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHours(2),
        'finished_at' => now()->subHour(),
        'total_questions' => 20,
        'correct_answers' => 12,
    ]);
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_EXAM,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(),
        'finished_at' => now(),
        'total_questions' => 10,
        'correct_answers' => 15,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('overallStats.best_score', 15)
    );
});

it('calculates total_seconds as sum of completed attempt durations', function () {
    $now = now();
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => (clone $now)->subHours(2),
        'finished_at' => $now,
        'total_questions' => 10,
        'correct_answers' => 5,
    ]);
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_EXAM,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => (clone $now)->subMinutes(30),
        'finished_at' => $now,
        'total_questions' => 10,
        'correct_answers' => 8,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('overallStats.total_seconds', 9000)
    );
});

it('skips in_progress attempts in total_seconds calculation', function () {
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_IN_PROGRESS,
        'started_at' => now()->subHour(),
        'total_questions' => 10,
        'correct_answers' => 5,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('overallStats.total_seconds', 0)
    );
});

// ─── Evaluation ───────────────────────────────────────────────

it('returns excellent evaluation when average is 90% or above', function () {
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(),
        'finished_at' => now(),
        'total_questions' => 10,
        'correct_answers' => 9,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('evaluation.level', 'excellent')
        ->where('evaluation.label', 'ممتاز')
        ->where('evaluation.color', 'emerald')
    );
});

it('returns very good evaluation when average is 75% or above', function () {
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(),
        'finished_at' => now(),
        'total_questions' => 10,
        'correct_answers' => 8,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('evaluation.level', 'very_good')
        ->where('evaluation.label', 'جيد جداً')
    );
});

it('returns good evaluation when average is 60% or above', function () {
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(),
        'finished_at' => now(),
        'total_questions' => 10,
        'correct_answers' => 6,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('evaluation.level', 'good')
        ->where('evaluation.label', 'جيد')
    );
});

it('returns passable evaluation when average is 45% or above', function () {
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(),
        'finished_at' => now(),
        'total_questions' => 10,
        'correct_answers' => 5,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('evaluation.level', 'passable')
        ->where('evaluation.label', 'مقبول')
    );
});

it('returns weak evaluation when average is below 45%', function () {
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(),
        'finished_at' => now(),
        'total_questions' => 10,
        'correct_answers' => 4,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('evaluation.level', 'weak')
        ->where('evaluation.label', 'ضعيف')
    );
});

it('returns no_data evaluation when no completed attempts exist', function () {
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_IN_PROGRESS,
        'started_at' => now(),
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('evaluation.level', 'no_data')
        ->where('evaluation.label', 'لا توجد نتائج')
    );
});

// ─── Topic Breakdown ──────────────────────────────────────────

it('returns topic breakdown grouped by topic', function () {
    $topicA = Topic::factory()->create(['name' => 'Algebra']);
    $topicB = Topic::factory()->create(['name' => 'Geometry']);

    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topicA->id,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHours(2),
        'finished_at' => now()->subHour(),
        'total_questions' => 10,
        'correct_answers' => 8,
    ]);
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topicA->id,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHours(3),
        'finished_at' => now()->subHours(2),
        'total_questions' => 5,
        'correct_answers' => 3,
    ]);
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topicB->id,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHours(4),
        'finished_at' => now()->subHours(3),
        'total_questions' => 20,
        'correct_answers' => 10,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('topicBreakdown', 2)
        ->where('topicBreakdown.0.topic_name', 'Algebra')
        ->where('topicBreakdown.0.attempts_count', 2)
        ->where('topicBreakdown.0.average_percentage', 73)
        ->where('topicBreakdown.0.status', 'average')
        ->where('topicBreakdown.1.topic_name', 'Geometry')
        ->where('topicBreakdown.1.attempts_count', 1)
        ->where('topicBreakdown.1.average_percentage', 50)
        ->where('topicBreakdown.1.status', 'average')
    );
});

it('excludes attempts without topic_id from topic breakdown', function () {
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(),
        'finished_at' => now(),
        'total_questions' => 10,
        'correct_answers' => 5,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('topicBreakdown', [])
    );
});

// ─── Competition Breakdown ────────────────────────────────────

it('returns competition breakdown for exam attempts only', function () {
    $comp = Competition::factory()->create(['name' => 'Final Exam']);

    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_EXAM,
        'competition_id' => $comp->id,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(),
        'finished_at' => now(),
        'total_questions' => 10,
        'correct_answers' => 7,
    ]);
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_EXAM,
        'competition_id' => $comp->id,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHours(2),
        'finished_at' => now()->subHour(),
        'total_questions' => 10,
        'correct_answers' => 9,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('competitionBreakdown', 1)
        ->where('competitionBreakdown.0.competition_name', 'Final Exam')
        ->where('competitionBreakdown.0.attempts_count', 2)
        ->where('competitionBreakdown.0.average_percentage', 80)
    );
});

it('does not include practice attempts in competition breakdown', function () {
    $topic = Topic::factory()->create();
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(),
        'finished_at' => now(),
        'total_questions' => 10,
        'correct_answers' => 8,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('competitionBreakdown', [])
    );
});

// ─── Recent Results ───────────────────────────────────────────

it('returns recent results limited to 10', function () {
    foreach (range(1, 12) as $i) {
        Attempt::create([
            'user_id' => $this->user->id,
            'type' => Attempt::TYPE_PRACTICE,
            'status' => Attempt::STATUS_COMPLETED,
            'started_at' => now()->subHours(13 - $i),
            'finished_at' => now()->subHours(13 - $i)->addMinutes(30),
            'total_questions' => 10,
            'correct_answers' => $i,
        ]);
    }

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('recentResults', 10)
    );
});

it('recent results include correct fields', function () {
    $topic = Topic::factory()->create(['name' => 'Physics']);
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subHour(),
        'finished_at' => now(),
        'total_questions' => 10,
        'correct_answers' => 7,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('recentResults.0', fn ($item) => $item
            ->has('id')
            ->has('type')
            ->has('subject_name')
            ->has('correct_answers')
            ->has('total_questions')
            ->has('percentage')
            ->has('created_at')
        )
    );
});

// ─── Progress ─────────────────────────────────────────────────

it('returns progress in chronological order', function () {
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subDays(2),
        'finished_at' => now()->subDays(2)->addHour(),
        'total_questions' => 10,
        'correct_answers' => 5,
    ]);
    $this->travel(1)->day();
    Attempt::create([
        'user_id' => $this->user->id,
        'type' => Attempt::TYPE_EXAM,
        'status' => Attempt::STATUS_COMPLETED,
        'started_at' => now()->subDay(),
        'finished_at' => now()->subDay()->addHour(),
        'total_questions' => 10,
        'correct_answers' => 8,
    ]);

    $response = $this->actingAs($this->user)->get(route('student.results.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('progress', 2)
        ->where('progress.0.percentage', 50)
        ->where('progress.0.type', Attempt::TYPE_PRACTICE)
        ->where('progress.1.percentage', 80)
        ->where('progress.1.type', Attempt::TYPE_EXAM)
    );
});
