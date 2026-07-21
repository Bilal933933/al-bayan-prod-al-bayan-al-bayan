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

it('shows empty state when no attempts exist', function () {
    $response = $this->actingAs($this->user)->get(route('student.attempts.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('student/attempts/index')
        ->where('attempts.data', [])
    );
});

it('lists all attempts for the user', function () {
    $topic = Topic::factory()->active()->create(['default_questions_count' => 2]);
    Question::factory(2)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));

    $this->actingAs($this->user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);
    Attempt::where('user_id', $this->user->id)->update(['status' => Attempt::STATUS_COMPLETED, 'finished_at' => now()]);
    $this->actingAs($this->user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);

    $response = $this->actingAs($this->user)->get(route('student.attempts.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('student/attempts/index')
        ->has('attempts.data', 2)
    );
});

it('filters attempts by type', function () {
    $topic = Topic::factory()->active()->create(['default_questions_count' => 1]);
    Question::factory(1)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));

    $this->actingAs($this->user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);

    $practice = $this->actingAs($this->user)->get(route('student.attempts.index', ['type' => 'practice']));
    $practice->assertInertia(fn ($page) => $page->has('attempts.data', 1));

    $exam = $this->actingAs($this->user)->get(route('student.attempts.index', ['type' => 'exam']));
    $exam->assertInertia(fn ($page) => $page->has('attempts.data', 0));
});

it('includes subject_name for practice attempts', function () {
    $topic = Topic::factory()->active()->create(['name' => 'محور تجريبي', 'default_questions_count' => 1]);
    Question::factory(1)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));

    $this->actingAs($this->user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);

    $response = $this->actingAs($this->user)->get(route('student.attempts.index'));
    $response->assertInertia(fn ($page) => $page
        ->where('attempts.data.0.subject_name', 'محور تجريبي')
    );
});

it('includes subject_name for exam attempts', function () {
    $competition = Competition::factory()->standalone()->active()->create(['name' => 'مسابقة تجريبية']);
    $topic = Topic::factory()->active()->create();
    $competition->topics()->attach($topic, ['questions_count' => 1, 'duration_minutes' => 10, 'difficulty_distribution' => null]);
    Question::factory(1)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));
    $this->user->competitions()->attach($competition, ['joined_at' => now()]);

    $this->actingAs($this->user)->post(route('student.competitions.attempts.start', $competition));

    $response = $this->actingAs($this->user)->get(route('student.attempts.index'));
    $response->assertInertia(fn ($page) => $page
        ->where('attempts.data.0.subject_name', 'مسابقة تجريبية')
    );
});

it('shows attempts in reverse chronological order', function () {
    $topic = Topic::factory()->active()->create(['default_questions_count' => 1]);
    Question::factory(1)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));

    $this->actingAs($this->user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);
    Attempt::where('user_id', $this->user->id)->update(['status' => Attempt::STATUS_COMPLETED, 'finished_at' => now()]);
    $this->travel(1)->second();
    $this->actingAs($this->user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);

    $response = $this->actingAs($this->user)->get(route('student.attempts.index'));
    $response->assertInertia(fn ($page) => $page
        ->has('attempts.data', 2)
        ->where('attempts.data.0.id', 2)
        ->where('attempts.data.1.id', 1)
    );
});

it('paginates attempts', function () {
    $topic = Topic::factory()->active()->create(['default_questions_count' => 1]);
    Question::factory(1)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));

    foreach (range(1, 20) as $i) {
        $this->actingAs($this->user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);
        Attempt::where('user_id', $this->user->id)->update(['status' => Attempt::STATUS_COMPLETED, 'finished_at' => now()]);
    }

    $response = $this->actingAs($this->user)->get(route('student.attempts.index'));
    $response->assertInertia(fn ($page) => $page
        ->has('attempts.data', 15)
    );
});

it('guest cannot access attempts index', function () {
    $response = $this->get(route('student.attempts.index'));

    $response->assertRedirect(route('login'));
});
