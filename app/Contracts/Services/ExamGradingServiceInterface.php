<?php

namespace App\Contracts\Services;

use App\Models\Attempt;

interface ExamGradingServiceInterface
{
    public function finalizeAttempt(Attempt $attempt): void;

    public function handleExpiredSections(Attempt $attempt): void;
}
