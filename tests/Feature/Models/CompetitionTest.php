<?php

use App\Models\Competition;

it('scope active returns only active competitions', function () {
    Competition::factory()->active()->create(['name' => 'A']);
    Competition::factory()->inactive()->create(['name' => 'B']);

    expect(Competition::active()->get())->toHaveCount(1);
});

it('scope roots returns competitions with no parent', function () {
    $root = Competition::factory()->standalone()->create(['name' => 'Root']);
    Competition::factory()->child()->create(['parent_id' => $root->id]);

    $roots = Competition::roots()->get();

    expect($roots)->toHaveCount(1);
    expect($roots->first()->name)->toBe('Root');
});

it('isContainer returns true for container classification', function () {
    $container = Competition::factory()->container()->create();
    $standalone = Competition::factory()->standalone()->create();

    expect($container->isContainer())->toBeTrue();
    expect($standalone->isContainer())->toBeFalse();
});

it('isStandalone returns true for standalone classification', function () {
    $standalone = Competition::factory()->standalone()->create();
    $child = Competition::factory()->child()->create(['parent_id' => Competition::factory()->container()->create()->id]);

    expect($standalone->isStandalone())->toBeTrue();
    expect($child->isStandalone())->toBeFalse();
});

it('isChild returns true for child classification', function () {
    $container = Competition::factory()->container()->create();
    $child = Competition::factory()->child()->create(['parent_id' => $container->id]);

    expect($child->isChild())->toBeTrue();
    expect($container->isChild())->toBeFalse();
});

it('can_have_topics returns false for container', function () {
    $container = Competition::factory()->container()->create();
    $standalone = Competition::factory()->standalone()->create();

    expect($container->can_have_topics)->toBeFalse();
    expect($standalone->can_have_topics)->toBeTrue();
});

it('canBeParentOf returns true only for container', function () {
    $container = Competition::factory()->container()->create();
    $standalone = Competition::factory()->standalone()->create();

    expect($container->canBeParentOf())->toBeTrue();
    expect($standalone->canBeParentOf())->toBeFalse();
});

it('image_url returns null when no image is set', function () {
    $competition = Competition::factory()->create(['image' => null]);

    expect($competition->image_url)->toBeNull();
});

it('image_url returns storage URL when image is set', function () {
    $competition = Competition::factory()->create(['image' => 'photos/test.jpg']);

    expect($competition->image_url)->toContain('storage/photos/test.jpg');
});

it('has children relationship for containers', function () {
    $container = Competition::factory()->container()->create();
    Competition::factory()->child()->create(['parent_id' => $container->id]);

    expect($container->children)->toHaveCount(1);
});

it('has parent relationship', function () {
    $container = Competition::factory()->container()->create();
    $child = Competition::factory()->child()->create(['parent_id' => $container->id]);

    expect($child->parent->id)->toBe($container->id);
});
