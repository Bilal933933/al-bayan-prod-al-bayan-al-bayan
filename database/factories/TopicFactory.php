<?php

namespace Database\Factories;

use App\Models\Topic;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Topic>
 */
class TopicFactory extends Factory
{
    protected $model = Topic::class;

    public function definition(): array
    {
        $name = 'المحور '.fake()->unique()->word();

        return [
            'code' => Str::slug($name).'-'.fake()->unique()->randomNumber(4),
            'name' => $name,
            'visibility' => fake()->randomElement(['general', 'private']),
            'description' => fake()->sentence(8),
            'default_questions_count' => fake()->randomElement([5, 10, 15, 20]),
            'default_duration_minutes' => fake()->optional(0.7)->numberBetween(5, 45),
            'is_active' => true,
        ];
    }

    public function general(): static
    {
        return $this->state(fn () => [
            'visibility' => 'general',
        ]);
    }

    public function private(): static
    {
        return $this->state(fn () => [
            'visibility' => 'private',
        ]);
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'is_active' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => [
            'is_active' => false,
        ]);
    }
}
