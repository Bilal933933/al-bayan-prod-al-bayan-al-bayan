<?php

namespace App\Repositories;

use App\Contracts\Repositories\QuestionRepositoryInterface;
use App\Models\Question;
use App\Models\QuestionOption;

class QuestionRepository implements QuestionRepositoryInterface
{
    /**
     * @param  array{topic_id: int, type: string, text: string, difficulty: string, explanation: string|null, is_active: bool}  $data
     */
    public function createQuestion(array $data): Question
    {
        return Question::create($data);
    }

    /**
     * @param  array{question_id: int, text: string, is_correct: bool, order: int}[]  $options
     */
    public function insertOptions(array $options): void
    {
        QuestionOption::insert($options);
    }
}
