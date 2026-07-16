<?php

use App\Models\AttemptSection;

it('isSubmitted returns true when submitted_at is set', function () {
    $submitted = new AttemptSection(['submitted_at' => now()]);
    $pending = new AttemptSection(['submitted_at' => null]);

    expect($submitted->isSubmitted())->toBeTrue();
    expect($pending->isSubmitted())->toBeFalse();
});
