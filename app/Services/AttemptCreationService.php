<?php

namespace App\Services;

use App\Models\Attempt;
use App\Models\AttemptQuestion;
use App\Models\AttemptSection;
use App\Models\Competition;
use App\Models\Question;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class AttemptCreationService
{
    public function createPractice(
        User $user,
        Topic $topic,
        ?string $difficulty = null,
        ?int $questionsCount = null,
        bool $withTimer = true,
    ): Attempt {
        $finalCount = $questionsCount ?? $topic->default_questions_count;
        $duration = $withTimer ? ($topic->default_duration_minutes ?? 15) : null;

        return DB::transaction(function () use ($user, $topic, $difficulty, $finalCount, $duration, $withTimer) {
            $query = $topic->questions()->active();

            if ($difficulty !== null) {
                $query->where('difficulty', $difficulty);
            }

            $questions = $query->inRandomOrder()
                ->limit($finalCount)
                ->get();

            $attempt = Attempt::create([
                'user_id' => $user->id,
                'type' => Attempt::TYPE_PRACTICE,
                'topic_id' => $topic->id,
                'status' => Attempt::STATUS_IN_PROGRESS,
                'with_timer' => $withTimer,
                'total_questions' => $questions->count(),
                'started_at' => now(),
            ]);

            $section = AttemptSection::create([
                'attempt_id' => $attempt->id,
                'topic_id' => $topic->id,
                'questions_count' => $questions->count(),
                'duration_minutes' => $duration,
                'order' => 0,
                'started_at' => now(),
            ]);

            $this->insertAttemptQuestions($section, $questions);

            return $attempt;
        });
    }

    public function createExam(User $user, Competition $competition): Attempt
    {
        $topics = $competition->topics()
            ->where('topics.is_active', true)
            ->get();

        $attempt = DB::transaction(function () use ($user, $competition, $topics) {
            $attempt = Attempt::create([
                'user_id' => $user->id,
                'type' => Attempt::TYPE_EXAM,
                'competition_id' => $competition->id,
                'status' => Attempt::STATUS_IN_PROGRESS,
                'with_timer' => true,
                'started_at' => now(),
            ]);

            $totalQuestions = 0;

            foreach ($topics as $order => $topic) {
                $topicQuestions = $this->selectQuestionsForTopic(
                    $topic,
                    $topic->pivot->questions_count,
                    $topic->pivot->difficulty_distribution,
                );

                if ($topicQuestions->isEmpty()) {
                    continue;
                }

                $totalQuestions += $topicQuestions->count();

                $section = AttemptSection::create([
                    'attempt_id' => $attempt->id,
                    'topic_id' => $topic->id,
                    'questions_count' => $topicQuestions->count(),
                    'duration_minutes' => $topic->pivot->duration_minutes,
                    'order' => $order,
                    'started_at' => $order === 0 ? now() : null,
                ]);

                $this->insertAttemptQuestions($section, $topicQuestions);
            }

            $attempt->update(['total_questions' => $totalQuestions]);

            return $attempt;
        });

        return $attempt->load(['sections.questions']);
    }

    /** @param array<string, int>|null $difficultyDistribution
     * @return Collection<int, Question> */
    private function selectQuestionsForTopic(Topic $topic, int $plannedCount, ?array $difficultyDistribution): Collection
    {
        $query = $topic->questions()->active();

        if ($difficultyDistribution) {
            $perDifficulty = $this->calculateDistribution($plannedCount, $difficultyDistribution);

            $questionIds = collect();
            foreach ($perDifficulty as $difficulty => $count) {
                $questions = (clone $query)
                    ->where('difficulty', $difficulty)
                    ->inRandomOrder()
                    ->limit($count)
                    ->pluck('id');

                $questionIds = $questionIds->concat($questions);
            }

            return $topic->questions()->active()->whereIn('id', $questionIds)->get();
        }

        return $query->inRandomOrder()->limit($plannedCount)->get();
    }

    /** @param array<string, int> $distribution
     * @return array<string, int> */
    private function calculateDistribution(int $total, array $distribution): array
    {
        $levels = [Question::DIFFICULTY_EASY, Question::DIFFICULTY_MEDIUM, Question::DIFFICULTY_HARD];
        $counts = [];
        $assigned = 0;

        $highestLevel = null;
        $highestPercentage = 0;

        foreach ($levels as $level) {
            $percentage = $distribution[$level] ?? 0;
            $counts[$level] = (int) round(($percentage / 100) * $total);
            $assigned += $counts[$level];

            if ($percentage > $highestPercentage) {
                $highestPercentage = $percentage;
                $highestLevel = $level;
            }
        }

        $diff = $total - $assigned;
        if ($diff !== 0 && $highestLevel !== null) {
            $counts[$highestLevel] += $diff;
        }

        return $counts;
    }

    /** @param Collection<int, Question> $questions */
    private function insertAttemptQuestions(AttemptSection $section, Collection $questions): void
    {
        $data = $questions->values()->map(fn ($question, $index) => [
            'attempt_section_id' => $section->id,
            'question_id' => $question->id,
            'order' => $index,
            'created_at' => now(),
            'updated_at' => now(),
        ])->toArray();

        AttemptQuestion::insert($data);
    }
}
