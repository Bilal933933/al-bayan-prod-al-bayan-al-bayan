<?php

use App\Models\User;

it('detects admin role', function () {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->create(['role' => 'student']);

    expect($admin->isAdmin())->toBeTrue();
    expect($student->isAdmin())->toBeFalse();
});

it('detects student role', function () {
    $student = User::factory()->create(['role' => 'student']);
    $admin = User::factory()->admin()->create();

    expect($student->isStudent())->toBeTrue();
    expect($admin->isStudent())->toBeFalse();
});

it('scope admins returns only admin users', function () {
    User::factory()->admin()->create();
    User::factory()->count(2)->create(['role' => 'student']);

    expect(User::admins()->count())->toBe(1);
});
