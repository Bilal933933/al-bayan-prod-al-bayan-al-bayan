<?php

namespace Database\Seeders;

use App\Models\Competition;
use App\Models\Topic;
use Illuminate\Database\Seeder;

class TopicSeeder extends Seeder
{
    public function run(): void
    {
        $competitions = Competition::active()
            ->whereIn('classification', ['standalone', 'child'])
            ->get();

        if ($competitions->isEmpty()) {
            Topic::factory(5)
                ->sequence(fn ($seq) => [
                    'code' => 'topic-'.$seq->index + 1,
                    'name' => 'محور عام '.($seq->index + 1),
                ])
                ->general()
                ->create();

            return;
        }

        foreach ($competitions as $competition) {
            $topicCount = fake()->numberBetween(2, 4);

            $topics = Topic::factory($topicCount)
                ->sequence(fn ($seq) => [
                    'code' => 'topic-'.$competition->id.'-'.$seq->index + 1,
                ])
                ->create();

            foreach ($topics as $topic) {
                $competition->topics()->attach($topic->id, [
                    'questions_count' => fake()->randomElement([10, 15, 20, 25]),
                    'duration_minutes' => fake()->randomElement([15, 20, 30, 45, 60]),
                    'difficulty_distribution' => [
                        'easy' => fake()->numberBetween(20, 40),
                        'medium' => fake()->numberBetween(30, 50),
                        'hard' => fake()->numberBetween(10, 30),
                    ],
                ]);
            }
        }
    }
}
