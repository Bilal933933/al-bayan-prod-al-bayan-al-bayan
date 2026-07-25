<?php

namespace App\Contracts\Services;

use App\Models\Attempt;
use App\Models\Competition;
use App\Models\Topic;
use App\Models\User;

interface AttemptCreationServiceInterface
{
    public function createPractice(
        User $user,
        Topic $topic,
        ?string $difficulty = null,
        ?int $questionsCount = null,
        bool $withTimer = true,
    ): Attempt;

    public function createExam(User $user, Competition $competition): Attempt;
}
