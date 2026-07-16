<?php

use App\Models\Topic;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

it('scope active returns only active topics', function () {
    Topic::factory()->active()->create(['name' => 'A']);
    Topic::factory()->inactive()->create(['name' => 'B']);

    $active = Topic::active()->get();

    expect($active)->toHaveCount(1);
    expect($active->first()->name)->toBe('A');
});

it('scope general returns only general visibility topics', function () {
    Topic::factory()->general()->create(['name' => 'Public']);
    Topic::factory()->private()->create(['name' => 'Private']);

    $general = Topic::general()->get();

    expect($general)->toHaveCount(1);
    expect($general->first()->name)->toBe('Public');
});

it('scope private returns only private visibility topics', function () {
    Topic::factory()->private()->create(['name' => 'Private']);
    Topic::factory()->general()->create(['name' => 'Public']);

    $private = Topic::private()->get();

    expect($private)->toHaveCount(1);
    expect($private->first()->name)->toBe('Private');
});

it('isGeneral returns true for general visibility', function () {
    $topic = Topic::factory()->general()->create();

    expect($topic->isGeneral())->toBeTrue();
    expect($topic->isPrivate())->toBeFalse();
});

it('isPrivate returns true for private visibility', function () {
    $topic = Topic::factory()->private()->create();

    expect($topic->isPrivate())->toBeTrue();
    expect($topic->isGeneral())->toBeFalse();
});

it('has questions relationship', function () {
    $topic = Topic::factory()->create();

    expect($topic->questions())->toBeInstanceOf(HasMany::class);
});

it('has competitions relationship', function () {
    $topic = Topic::factory()->create();

    expect($topic->competitions())->toBeInstanceOf(BelongsToMany::class);
});

it('has attempts relationship scoped to practice', function () {
    $topic = Topic::factory()->create();

    expect($topic->attempts())->toBeInstanceOf(HasMany::class);
});
