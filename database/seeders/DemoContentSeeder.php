<?php

namespace Database\Seeders;

use App\Models\Competition;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Topic;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoContentSeeder extends Seeder
{
    private const TOPICS = [
        ['name' => 'التفسير', 'description' => 'تفسير القرآن الكريم وأسباب النزول'],
        ['name' => 'العقيدة', 'description' => 'أصول الإيمان والتوحيد'],
        ['name' => 'الحديث', 'description' => 'مصطلح الحديث والمتون'],
        ['name' => 'الفقه', 'description' => 'أحكام العبادات والمعاملات'],
        ['name' => 'السيرة', 'description' => 'سيرة النبي ﷺ والتاريخ الإسلامي'],
        ['name' => 'النحو', 'description' => 'قواعد النحو والإعراب'],
        ['name' => 'البلاغة', 'description' => 'البيان والبديع والمعاني'],
        ['name' => 'الصرف', 'description' => 'علم الصرف وتصريف الأفعال'],
        ['name' => 'الأدب', 'description' => 'الشعر والنثر قديماً وحديثاً'],
        ['name' => 'التجويد', 'description' => 'أحكام التجويد والقراءات'],
    ];

    public function run(): void
    {
        $this->createTopics();
        $this->createQuestions();
        $this->createCompetition();
    }

    private function createTopics(): void
    {
        foreach (self::TOPICS as $data) {
            Topic::create([
                'code' => Str::slug($data['name']),
                'name' => $data['name'],
                'description' => $data['description'],
                'visibility' => 'general',
                'is_active' => true,
                'default_questions_count' => 10,
                'default_duration_minutes' => 15,
            ]);
        }
    }

    private function createQuestions(): void
    {
        $topics = Topic::all();
        $difficulties = [Question::DIFFICULTY_EASY, Question::DIFFICULTY_MEDIUM, Question::DIFFICULTY_HARD];

        foreach ($topics as $topic) {
            for ($i = 0; $i < 20; $i++) {
                $isMcq = $i % 5 !== 0;
                $difficulty = $difficulties[array_rand($difficulties)];

                $questionText = match ($difficulty) {
                    Question::DIFFICULTY_EASY => 'ما هو المقصود بـ "'.fake()->word().'" في '.$topic->name.'؟',
                    Question::DIFFICULTY_MEDIUM => 'كيف تفرق بين "'.fake()->word().'" و"'.fake()->word().'" في '.$topic->name.'؟',
                    Question::DIFFICULTY_HARD => 'ما الحكم عند "'.fake()->word().'" في سياق '.$topic->name.' مع ذكر الأدلة؟',
                };

                $question = Question::factory()->create([
                    'topic_id' => $topic->id,
                    'type' => $isMcq ? Question::TYPE_MCQ : Question::TYPE_TRUE_FALSE,
                    'text' => $questionText,
                    'difficulty' => $difficulty,
                    'explanation' => fake()->optional(0.7)->sentence(15),
                    'is_active' => true,
                ]);

                $this->createOptions($question, $isMcq);
            }
        }
    }

    private function createOptions(Question $question, bool $isMcq): void
    {
        if ($isMcq) {
            $correctIndex = array_rand(range(0, 3));

            for ($j = 0; $j < 4; $j++) {
                QuestionOption::factory()->create([
                    'question_id' => $question->id,
                    'text' => 'الخيار '.chr(65 + $j).': '.fake()->sentence(5),
                    'is_correct' => $j === $correctIndex,
                    'order' => $j,
                ]);
            }
        } else {
            $isCorrect = (bool) random_int(0, 1);

            QuestionOption::factory()->create([
                'question_id' => $question->id,
                'text' => 'صح',
                'is_correct' => $isCorrect,
                'order' => 0,
            ]);

            QuestionOption::factory()->create([
                'question_id' => $question->id,
                'text' => 'خطأ',
                'is_correct' => ! $isCorrect,
                'order' => 1,
            ]);
        }
    }

    private function createCompetition(): void
    {
        $topics = Topic::inRandomOrder()->take(3)->get();

        $competition = Competition::factory()->standalone()->create([
            'name' => 'مسابقة البيان التأهيلية',
            'code' => 'BAYAN-01',
            'slug' => 'bayan-qualifier',
            'description' => 'مسابقة شاملة لمحاور التفسير والعقيدة والفقه.',
            'color' => '#1F6F5C',
            'icon' => 'trophy',
            'is_active' => true,
            'start_date' => now()->subDays(5),
            'end_date' => now()->addDays(30),
        ]);

        foreach ($topics as $topic) {
            $competition->topics()->attach($topic, [
                'questions_count' => 5,
                'duration_minutes' => 10,
                'difficulty_distribution' => json_encode([
                    Question::DIFFICULTY_EASY => 40,
                    Question::DIFFICULTY_MEDIUM => 40,
                    Question::DIFFICULTY_HARD => 20,
                ]),
            ]);
        }
    }
}
