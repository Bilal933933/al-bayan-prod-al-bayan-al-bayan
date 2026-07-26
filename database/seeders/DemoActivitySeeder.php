<?php

namespace Database\Seeders;

use App\Contracts\Services\AttemptCreationServiceInterface;
use App\Contracts\Services\ExamGradingServiceInterface;
use App\Models\AttemptQuestion;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoActivitySeeder extends Seeder
{
    public function run(
        AttemptCreationServiceInterface $attemptService,
        ExamGradingServiceInterface $gradingService,
    ): void {
        abort_if(app()->environment('production'), 403, 'لا يمكن تشغيل هذا السيدر في بيئة الإنتاج.');

        $topics = Topic::active()->general()->get();

        $users = collect(range(1, 25))->map(function (int $i) {
            return User::factory()->create([
                'name' => 'متدرب ' . $i,
                'email' => 'demo+' . $i . '@albayan.test',
                'email_verified_at' => now(),
            ]);
        });

        foreach ($users as $user) {
            $attemptsCount = random_int(1, 8);

            for ($i = 0; $i < $attemptsCount; $i++) {
                $topic = $topics->random();
                $withTimer = (bool) random_int(0, 1);

                $attempt = $attemptService->createPractice(
                    $user,
                    $topic,
                    questionsCount: random_int(5, 10),
                    withTimer: $withTimer,
                );

                $attempt->load('sections.questions');
                $section = $attempt->sections->first();

                $correctRate = random_int(40, 95) / 100;

                foreach ($section->questions as $question) {
                    $options = $question->question->options;
                    $correctOption = $options->firstWhere('is_correct');

                    $isCorrect = (float) random_int(0, 100) / 100 <= $correctRate;
                    $selectedOption = $isCorrect
                        ? $correctOption
                        : $options->where('id', '!=', $correctOption->id)->random();

                    $question->update([
                        'selected_option_id' => $selectedOption->id,
                        'is_correct' => $isCorrect,
                    ]);
                }

                $attempt->increment('answered_count', $section->questions->count());

                $gradingService->finalizeAttempt($attempt);
            }
        }

        $this->command?->info('✓ Demo users created: ' . $users->count());
        $this->command?->info('  Emails: demo+1@albayan.test … demo+' . $users->count() . '@albayan.test');
    }
}
