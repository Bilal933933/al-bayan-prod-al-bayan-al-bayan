<?php

namespace Database\Seeders;

use App\Models\Attempt;
use App\Models\AttemptQuestion;
use App\Models\AttemptSection;
use App\Models\Competition;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Topic;
use App\Models\User;
use App\Models\UserScore;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    private const STUDENTS = [
        ['name' => 'أحمد محمد', 'email' => 'ahmed@test.com'],
        ['name' => 'سارة عبد الله', 'email' => 'sara@test.com'],
        ['name' => 'فاطمة علي', 'email' => 'fatima@test.com'],
        ['name' => 'يوسف عمر', 'email' => 'yousef@test.com'],
        ['name' => 'مريم خالد', 'email' => 'mariam@test.com'],
        ['name' => 'عمر حسن', 'email' => 'omar@test.com'],
        ['name' => 'نورة أحمد', 'email' => 'noura@test.com'],
        ['name' => 'عبد الرحمن سعيد', 'email' => 'abdelrahman@test.com'],
        ['name' => 'هدى محمود', 'email' => 'hoda@test.com'],
        ['name' => 'خالد إبراهيم', 'email' => 'khaled@test.com'],
    ];

    private const MCQ_OPTIONS = [
        ['النص الأصلي', 'النص المحرف', 'النص المختصر', 'النص المطول'],
        ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'],
        ['الجواب الصحيح', 'الجواب الخطأ', 'الجواب المحتمل', 'الجواب المستبعد'],
        ['المقدمة', 'العرض', 'الخاتمة', 'التمهيد'],
        ['المعنى الحقيقي', 'المعنى المجازي', 'المعنى الضمني', 'المعنى الصريح'],
        ['الأساسي', 'الفرعي', 'التكميلي', 'الاختياري'],
        ['الموافق', 'المخالف', 'المحايد', 'المتعارض'],
        ['الصحيح', 'السقيم', 'الضعيف', 'القوي'],
        ['المتقدم', 'المتوسط', 'المبتدئ', 'الخبير'],
        ['الكلّي', 'الجزئي', 'العام', 'الخاص'],
    ];

    private const TRUE_OPTIONS = ['صواب', 'خطأ'];

    public function run(): void
    {
        Cache::forget('leaderboard_weekly');
        Cache::forget('leaderboard_monthly');
        Cache::forget('leaderboard_all_time');
        Cache::forget('leaderboard_snapshot');

        $this->command->info('جاري إنشاء المستخدمين...');
        $users = $this->createUsers();

        $this->command->info('جاري إنشاء المسابقات والمحاور...');
        $this->call(CompetitionSeeder::class);
        $this->call(TopicSeeder::class);

        $this->command->info('جاري إنشاء الأسئلة...');
        $this->createQuestionsForAllTopics();

        $this->command->info('جاري إنشاء المحاولات...');
        $this->createAttemptsForUsers($users);

        $this->command->info('جاري حساب النقاط والـ Streak...');
        $this->backfillScores();

        $this->command->info('تم إنشاء جميع البيانات بنجاح!');
    }

    private function createUsers(): array
    {
        $users = [];

        foreach (self::STUDENTS as $data) {
            $users[] = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => 'student',
            ]);
        }

        return $users;
    }

    private function createQuestionsForAllTopics(): void
    {
        $topics = Topic::all();

        foreach ($topics as $topic) {
            $this->createMCQQuestions($topic, 3);
            $this->createTrueFalseQuestions($topic, 2);
        }
    }

    private function createMCQQuestions(Topic $topic, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            $options = self::MCQ_OPTIONS[array_rand(self::MCQ_OPTIONS)];
            $correctIndex = array_rand($options);

            $question = Question::create([
                'topic_id' => $topic->id,
                'type' => Question::TYPE_MCQ,
                'text' => 'سؤال اختيار من متعدد رقم '.($i + 1)." في {$topic->name}: ".fake()->sentence(8).'؟',
                'difficulty' => ['easy', 'medium', 'hard'][array_rand(['easy', 'medium', 'hard'])],
                'is_active' => true,
            ]);

            foreach ($options as $index => $optionText) {
                QuestionOption::create([
                    'question_id' => $question->id,
                    'text' => $optionText,
                    'is_correct' => $index === $correctIndex,
                    'order' => $index + 1,
                ]);
            }
        }
    }

    private function createTrueFalseQuestions(Topic $topic, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            $correctIndex = array_rand([0, 1]);

            $question = Question::create([
                'topic_id' => $topic->id,
                'type' => Question::TYPE_TRUE_FALSE,
                'text' => 'سؤال صح/خطأ رقم '.($i + 1)." في {$topic->name}: ".fake()->sentence(10).'؟',
                'difficulty' => ['easy', 'medium', 'hard'][array_rand(['easy', 'medium', 'hard'])],
                'is_active' => true,
            ]);

            foreach (self::TRUE_OPTIONS as $index => $optionText) {
                QuestionOption::create([
                    'question_id' => $question->id,
                    'text' => $optionText,
                    'is_correct' => $index === $correctIndex,
                    'order' => $index + 1,
                ]);
            }
        }
    }

    private function createAttemptsForUsers(array $users): void
    {
        $competitions = Competition::whereIn('classification', ['standalone', 'child'])->get();
        $topics = Topic::all();

        if ($topics->isEmpty() || $competitions->isEmpty()) {
            return;
        }

        $attemptTypes = ['exam', 'practice'];

        foreach ($users as $user) {
            $numAttempts = random_int(3, 5);
            $selectedTopics = $topics->random(min($numAttempts, $topics->count()));
            $dayOffset = 0;

            foreach ($selectedTopics as $topic) {
                $type = $attemptTypes[array_rand($attemptTypes)];
                $competition = $type === 'exam'
                    ? $competitions->random()
                    : null;

                $startedAt = now()->startOfDay()->subDays(6 - $dayOffset)->addHours(random_int(8, 20))->addMinutes(random_int(0, 59));
                $durationMinutes = random_int(5, 30);
                $finishedAt = (clone $startedAt)->addMinutes($durationMinutes);

                $questions = $topic->questions()->with('options')->get();

                if ($questions->isEmpty()) {
                    continue;
                }

                $attempt = Attempt::create([
                    'user_id' => $user->id,
                    'type' => $type,
                    'topic_id' => $topic->id,
                    'competition_id' => $competition?->id,
                    'status' => Attempt::STATUS_COMPLETED,
                    'started_at' => $startedAt,
                    'finished_at' => $finishedAt,
                    'total_questions' => $questions->count(),
                    'correct_answers' => 0,
                ]);

                $section = AttemptSection::create([
                    'attempt_id' => $attempt->id,
                    'topic_id' => $topic->id,
                    'questions_count' => $questions->count(),
                    'duration_minutes' => $durationMinutes,
                    'order' => 1,
                    'submitted_at' => $finishedAt,
                ]);

                $correctCount = 0;

                foreach ($questions as $order => $question) {
                    $selectedOption = $question->options->random();
                    $isCorrect = $selectedOption->is_correct;

                    if ($isCorrect) {
                        $correctCount++;
                    }

                    AttemptQuestion::create([
                        'attempt_section_id' => $section->id,
                        'question_id' => $question->id,
                        'selected_option_id' => $selectedOption->id,
                        'is_correct' => $isCorrect,
                        'order' => $order + 1,
                    ]);
                }

                $attempt->update(['correct_answers' => $correctCount]);

                $dayOffset++;
            }
        }
    }

    private function backfillScores(): void
    {
        $completedAttempts = Attempt::where('status', Attempt::STATUS_COMPLETED)
            ->with('user')
            ->get();

        $userDates = [];

        foreach ($completedAttempts as $attempt) {
            UserScore::create([
                'user_id' => $attempt->user_id,
                'attempt_id' => $attempt->id,
                'points' => $attempt->correct_answers * 10,
                'type' => $attempt->type,
            ]);

            if ($attempt->finished_at) {
                $date = $attempt->finished_at->copy()->startOfDay();
                $userDates[$attempt->user_id][] = $date;
            }
        }

        foreach ($userDates as $userId => $dates) {
            $user = User::find($userId);

            if (! $user) {
                continue;
            }

            $dateStrs = collect($dates)
                ->map(fn ($d) => $d->format('Y-m-d'))
                ->unique()
                ->sort()
                ->values();

            $streakDays = 0;
            $lastDate = null;

            foreach ($dateStrs as $dateStr) {
                $current = Carbon::parse($dateStr);

                if ($lastDate === null) {
                    $streakDays = 1;
                } elseif ($lastDate->diffInDays($current) == 1) {
                    $streakDays++;
                } elseif ($lastDate->diffInDays($current) > 1) {
                    $streakDays = 1;
                }

                $lastDate = $current;
            }

            $user->streak_days = $streakDays;
            $user->last_activity_at = $lastDate;
            $user->save();
        }
    }
}
