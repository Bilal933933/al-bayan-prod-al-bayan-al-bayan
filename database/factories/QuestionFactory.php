<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Topic;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Question>
 */
class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        return [
            'topic_id' => Topic::factory(),
            'type' => fake()->randomElement([Question::TYPE_MCQ, Question::TYPE_TRUE_FALSE]),
            'text' => fake()->sentence(10).'?',
            'difficulty' => fake()->randomElement([Question::DIFFICULTY_EASY, Question::DIFFICULTY_MEDIUM, Question::DIFFICULTY_HARD]),
            'explanation' => fake()->optional(0.7)->sentence(15),
            'is_active' => true,
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => ['is_active' => true]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function easy(): static
    {
        return $this->state(fn () => ['difficulty' => Question::DIFFICULTY_EASY]);
    }

    public function medium(): static
    {
        return $this->state(fn () => ['difficulty' => Question::DIFFICULTY_MEDIUM]);
    }

    public function hard(): static
    {
        return $this->state(fn () => ['difficulty' => Question::DIFFICULTY_HARD]);
    }

    public function mcq(): static
    {
        return $this->state(fn () => ['type' => Question::TYPE_MCQ]);
    }

    public function trueFalse(): static
    {
        return $this->state(fn () => ['type' => Question::TYPE_TRUE_FALSE]);
    }
}
