<?php

use App\Models\User;

it('guest is redirected to login', function () {
    $response = $this->get(route('admin.topics.index'));

    $response->assertRedirect(route('login'));
});

it('non-admin user receives 403', function () {
    $user = User::factory()->create(['role' => 'student']);

    $response = $this->actingAs($user)->get(route('admin.topics.index'));

    $response->assertForbidden();
});

it('admin user can access admin pages', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.topics.index'));

    $response->assertOk();
});

it('unverified admin is redirected to verification notice', function () {
    $admin = User::factory()->admin()->unverified()->create();

    $response = $this->actingAs($admin)->get(route('admin.topics.index'));

    $response->assertRedirect(route('verification.notice'));
});

it('unverified student is redirected to verification notice', function () {
    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->get(route('student.dashboard'));

    $response->assertRedirect(route('verification.notice'));
});
