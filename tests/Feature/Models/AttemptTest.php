<?php

use App\Models\Attempt;
use App\Models\Competition;
use App\Models\Topic;
use App\Models\User;

it('isPractice returns true for practice type', function () {
    $practice = new Attempt(['type' => Attempt::TYPE_PRACTICE]);
    $exam = new Attempt(['type' => Attempt::TYPE_EXAM]);

    expect($practice->isPractice())->toBeTrue();
    expect($exam->isPractice())->toBeFalse();
});

it('isExam returns true for exam type', function () {
    $exam = new Attempt(['type' => Attempt::TYPE_EXAM]);
    $practice = new Attempt(['type' => Attempt::TYPE_PRACTICE]);

    expect($exam->isExam())->toBeTrue();
    expect($practice->isExam())->toBeFalse();
});

it('isInProgress returns true for in_progress status', function () {
    $inProgress = new Attempt(['status' => Attempt::STATUS_IN_PROGRESS]);
    $completed = new Attempt(['status' => Attempt::STATUS_COMPLETED]);

    expect($inProgress->isInProgress())->toBeTrue();
    expect($completed->isInProgress())->toBeFalse();
});

it('isCompleted returns true for completed status', function () {
    $completed = new Attempt(['status' => Attempt::STATUS_COMPLETED]);
    $inProgress = new Attempt(['status' => Attempt::STATUS_IN_PROGRESS]);

    expect($completed->isCompleted())->toBeTrue();
    expect($inProgress->isCompleted())->toBeFalse();
});

it('subject_name returns topic name for practice', function () {
    $user = User::factory()->create();
    $topic = Topic::factory()->create(['name' => 'Algebra']);
    $attempt = Attempt::create([
        'user_id' => $user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'topic_id' => $topic->id,
        'status' => Attempt::STATUS_IN_PROGRESS,
    ]);

    expect($attempt->subject_name)->toBe('Algebra');
});

it('subject_name returns competition name for exam', function () {
    $user = User::factory()->create();
    $competition = Competition::factory()->standalone()->create(['name' => 'Final Exam']);
    $attempt = Attempt::create([
        'user_id' => $user->id,
        'type' => Attempt::TYPE_EXAM,
        'competition_id' => $competition->id,
        'status' => Attempt::STATUS_IN_PROGRESS,
    ]);

    expect($attempt->subject_name)->toBe('Final Exam');
});

it('subject_name returns em dash when no relation exists', function () {
    $user = User::factory()->create();
    $attempt = Attempt::create([
        'user_id' => $user->id,
        'type' => Attempt::TYPE_PRACTICE,
        'status' => Attempt::STATUS_IN_PROGRESS,
    ]);

    expect($attempt->subject_name)->toBe('—');
});
