<?php

use App\Http\Middleware\EnsureUserIsAdmin;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

it('allows admin users to pass through', function () {
    $user = User::factory()->admin()->create();
    $request = Request::create('/admin', 'GET');
    $request->setUserResolver(fn () => $user);

    $middleware = new EnsureUserIsAdmin;
    $response = $middleware->handle($request, fn ($req) => response('OK'));

    expect($response->getStatusCode())->toBe(200);
    expect($response->getContent())->toBe('OK');
});

it('aborts with 403 for non-admin users', function () {
    $user = User::factory()->create(['role' => 'student']);
    $request = Request::create('/admin', 'GET');
    $request->setUserResolver(fn () => $user);

    $middleware = new EnsureUserIsAdmin;

    try {
        $middleware->handle($request, fn ($req) => response('OK'));
        $this->fail('Expected HttpException was not thrown.');
    } catch (HttpException $e) {
        expect($e->getStatusCode())->toBe(403);
        expect($e->getMessage())->toBe('Unauthorized. Admin access only.');
    }
});

it('aborts with 403 for guest users', function () {
    $request = Request::create('/admin', 'GET');
    $request->setUserResolver(fn () => null);

    $middleware = new EnsureUserIsAdmin;

    try {
        $middleware->handle($request, fn ($req) => response('OK'));
        $this->fail('Expected HttpException was not thrown.');
    } catch (HttpException $e) {
        expect($e->getStatusCode())->toBe(403);
    }
});
