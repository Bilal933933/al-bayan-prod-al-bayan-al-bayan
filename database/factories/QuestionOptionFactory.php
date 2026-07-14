<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuestionOption>
 */
class QuestionOptionFactory extends Factory
{
    protected $model = QuestionOption::class;

    public function definition(): array
    {
        return [
            'question_id' => Question::factory(),
            'text' => fake()->sentence(6),
            'is_correct' => false,
            'order' => 0,
        ];
    }

    public function correct(): static
    {
        return $this->state(fn () => ['is_correct' => true]);
    }

    public function forQuestion(Question $question, int $order, bool $isCorrect = false): static
    {
        return $this->state(fn () => [
            'question_id' => $question->id,
            'order' => $order,
            'is_correct' => $isCorrect,
        ]);
    }
}
