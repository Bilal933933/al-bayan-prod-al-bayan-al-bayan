<?php

namespace Database\Factories;

use App\Models\Competition;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Competition>
 */
class CompetitionFactory extends Factory
{
    protected $model = Competition::class;

    private const ICONS = [
        'award', 'target', 'book-open', 'graduation-cap', 'trophy',
        'star', 'zap', 'flame', 'medal', 'crown',
    ];

    public function definition(): array
    {
        $name = $this->faker->name();

        return [
            'name' => $name,
            'code' => $this->faker->unique()->bothify('???###'),
            'slug' => Str::slug($name).'-'.$this->faker->unique()->randomNumber(4),
            'classification' => $this->faker->randomElement(['standalone', 'child']),
            'is_active' => true,
            'order' => 0,
            'color' => $this->faker->hexColor(),
            'icon' => $this->faker->randomElement(self::ICONS),
            'description' => $this->faker->sentence(8),
            'image' => null,
        ];
    }

    public function container(): static
    {
        return $this->state(fn () => [
            'classification' => 'container',
            'parent_id' => null,
        ]);
    }

    public function child(): static
    {
        return $this->state(fn () => [
            'classification' => 'child',
        ]);
    }

    public function standalone(): static
    {
        return $this->state(fn () => [
            'classification' => 'standalone',
            'parent_id' => null,
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
