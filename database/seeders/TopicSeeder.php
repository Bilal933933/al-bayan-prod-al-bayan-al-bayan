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
            Topic::factory(3)
                ->sequence(fn ($seq) => [
                    'code' => 'topic-'.$seq->index + 1,
                    'name' => 'محور عام '.($seq->index + 1),
                ])
                ->general()
                ->create();

            return;
        }

        foreach ($competitions as $competition) {
            $topicCount = $competition->classification === 'standalone' ? 1 : 2;

            $topics = Topic::factory($topicCount)
                ->sequence(fn ($seq) => [
                    'code' => 'topic-'.$competition->id.'-'.$seq->index + 1,
                    'default_questions_count' => 30,
                    'default_duration_minutes' => 30,
                ])
                ->create();

            foreach ($topics as $topic) {
                $competition->topics()->attach($topic->id, [
                    'questions_count' => 30,
                    'duration_minutes' => 30,
                    'difficulty_distribution' => ['easy' => 33, 'medium' => 34, 'hard' => 33],
                ]);
            }
        }
    }
}
