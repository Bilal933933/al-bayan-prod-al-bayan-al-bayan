<?php

use App\Models\Attempt;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Topic;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

it('lists all attempts with filters', function () {
    $user = User::factory()->create(['role' => 'student']);
    $topic = Topic::factory()->active()->create(['default_questions_count' => 1]);
    Question::factory(1)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));

    $this->actingAs($user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);

    $response = $this->actingAs($this->admin)->get(route('admin.attempts.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/attempts/index')
        ->has('attempts.data', 1)
    );
});

it('admin can view any attempt details', function () {
    $user = User::factory()->create(['role' => 'student']);
    $topic = Topic::factory()->active()->create(['default_questions_count' => 1]);
    Question::factory(1)->active()->for($topic)->create()->each(fn ($q) => QuestionOption::factory()->for($q)->correct()->create(['order' => 0]));

    $this->actingAs($user)->post(route('student.topics.attempts.start', $topic), ['with_timer' => true]);
    $attempt = Attempt::where('user_id', $user->id)->first();

    $response = $this->actingAs($this->admin)->get(route('admin.attempts.show', $attempt));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/attempts/show')
        ->where('attempt.id', $attempt->id)
        ->has('attempt.user')
    );
});
