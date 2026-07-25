<?php

namespace App\Contracts\Repositories;

use App\Models\Question;

interface QuestionRepositoryInterface
{
    public function createQuestion(array $data): Question;

    public function insertOptions(array $options): void;
}
