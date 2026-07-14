<?php

namespace App\Console\Commands;

use App\Models\Question;
use App\Models\Topic;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SeedDemoQuestions extends Command
{
    protected $signature = 'demo:seed-questions {--per-topic=50 : Number of questions per topic}';

    protected $description = 'Seed at least N questions per active topic without affecting existing questions';

    private const DIFFICULTIES = ['easy', 'medium', 'hard'];

    private const SUBJECTS = [
        'التوحيد', 'الفقه', 'التفسير', 'الحديث', 'السيرة',
        'النحو', 'الصرف', 'البلاغة', 'العقيدة', 'أصول الفقه',
        'مصطلح الحديث', 'القراءات', 'التجويد', 'الفرائض', 'المواريث',
    ];

    public function handle(): int
    {
        $perTopic = (int) $this->option('per-topic');
        $topics = Topic::where('is_active', true)->get();

        if ($topics->isEmpty()) {
            $this->warn('No active topics found.');

            return 0;
        }

        $this->info("Found {$topics->count()} active topics. Generating {$perTopic}+ questions each...");

        $totalQuestions = 0;
        $totalOptions = 0;

        $now = now();
        $questionsInsert = [];
        $optionsInsert = [];

        foreach ($topics as $topic) {
            $existingCount = $topic->questions()->count();
            $needed = max($perTopic - $existingCount, 0);

            if ($needed === 0) {
                $this->warn("  Topic [{$topic->name}] already has {$existingCount} questions. Skipping.");

                continue;
            }

            $this->line("  Topic [{$topic->name}]: creating {$needed} questions...");

            $subject = $this->fakerSubject();

            for ($i = 0; $i < $needed; $i++) {
                $difficulty = self::DIFFICULTIES[array_rand(self::DIFFICULTIES)];
                $type = mt_rand(0, 4) === 0 ? Question::TYPE_TRUE_FALSE : Question::TYPE_MCQ;

                $questionsInsert[] = [
                    'topic_id' => $topic->id,
                    'type' => $type,
                    'text' => $this->fakerQuestion($subject, $difficulty, $i),
                    'difficulty' => $difficulty,
                    'explanation' => mt_rand(0, 3) === 0 ? $this->fakerExplanation($subject) : null,
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        if (empty($questionsInsert)) {
            $this->info('All topics already have sufficient questions.');

            return 0;
        }

        foreach (array_chunk($questionsInsert, 200) as $chunk) {
            DB::table('questions')->insert($chunk);
        }

        $totalQuestions = count($questionsInsert);

        $this->line('  Creating question options...');
        $insertedQuestions = DB::table('questions')
            ->where('created_at', $now)
            ->orderBy('id')
            ->get(['id', 'type']);

        foreach ($insertedQuestions as $q) {
            if ($q->type === Question::TYPE_TRUE_FALSE) {
                $optionsInsert[] = [
                    'question_id' => $q->id,
                    'text' => 'صح',
                    'is_correct' => true,
                    'order' => 0,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
                $optionsInsert[] = [
                    'question_id' => $q->id,
                    'text' => 'خطأ',
                    'is_correct' => false,
                    'order' => 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            } else {
                $correctIdx = mt_rand(0, 3);
                for ($o = 0; $o < 4; $o++) {
                    $optionsInsert[] = [
                        'question_id' => $q->id,
                        'text' => $this->fakerOptionText($o, $correctIdx),
                        'is_correct' => $o === $correctIdx,
                        'order' => $o,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }
        }

        foreach (array_chunk($optionsInsert, 500) as $chunk) {
            DB::table('question_options')->insert($chunk);
        }

        $totalOptions = count($optionsInsert);

        $this->info("Done! Created {$totalQuestions} questions with {$totalOptions} options.");

        return 0;
    }

    private function fakerSubject(): string
    {
        return self::SUBJECTS[array_rand(self::SUBJECTS)];
    }

    private function fakerQuestion(string $subject, string $difficulty, int $index): string
    {
        $verbs = ['ما حكم', 'ما تعريف', 'ما دليل', 'ما شرط', 'ما ركن', 'ما واجب', 'ما فضل', 'ما حكمة', 'ما سبب', 'ما نتيجة'];
        $verb = $verbs[array_rand($verbs)];

        $nouns = ['العبادة', 'الطهارة', 'الصلاة', 'الزكاة', 'الصيام', 'الحج', 'الجهاد', 'النكاح', 'البيوع', 'الربا',
            'الإيمان', 'التوحيد', 'الشرك', 'النفاق', 'البدعة', 'السنة', 'الفرض', 'الواجب', 'المندوب', 'المباح',
            'المحرم', 'المكروه', 'الصحيح', 'الحسن', 'الضعيف', 'المتواتر', 'الآحاد', 'المعلول', 'الشاذ', 'المنكر',
        ];
        $noun = $nouns[array_rand($nouns)];

        $extras = ['في الإسلام؟', 'عند العلماء؟', 'في مذهب الإمام أحمد؟', 'في ضوء الكتاب والسنة؟', 'عند الفقهاء؟'];

        $templates = [
            "{$verb} {$noun} {$extras[array_rand($extras)]}",
            "اذكر {$noun} مع بيان {$noun}",
            "ما الفرق بين {$noun} و{$nouns[array_rand($nouns)]}؟",
            "عدد {$noun} وشروط {$noun}",
            "متى يكون {$noun} {$nouns[array_rand($nouns)]}؟",
            "ما المراد بـ {$noun} {$nouns[array_rand($nouns)]}؟",
            "بم يختلف {$noun} عن {$nouns[array_rand($nouns)]}؟",
            "ما حكم {$noun} في حالة {$nouns[array_rand($nouns)]}؟",
            "ماهو {$noun} {$extras[array_rand($extras)]}",
            "دلّل على {$noun} من القرآن والسنة",
        ];

        return $templates[array_rand($templates)];
    }

    private function fakerExplanation(string $subject): string
    {
        $starters = ['لأن', 'وذلك لأن', 'والدليل على ذلك', 'والسبب في ذلك', 'لما ثبت في'];
        $bodies = ['الكتاب والسنة', 'الإجماع', 'القواعد الفقهية', 'النصوص الشرعية', 'مقاصد الشريعة', 'أصول المذهب'];
        $endings = ['يدل على ذلك', 'هو الصحيح من أقوال العلماء', 'عليه أكثر أهل العلم', 'وهو الراجح', 'وهو المعتمد في المذهب'];

        return $starters[array_rand($starters)].' '.$bodies[array_rand($bodies)].' '.$endings[array_rand($endings)].'.';
    }

    private function fakerOptionText(int $optionIdx, int $correctIdx): string
    {
        if ($optionIdx === $correctIdx) {
            $answers = ['جائز', 'صحيح', 'واجب', 'مشروع', 'مباح', 'فرض', 'سنة مؤكدة', 'مستحب', 'حرام', 'مكروه كراهة تحريم',
                'لا يجوز', 'باطل', 'فاسد', 'نافذ', 'صحيح مع الكراهة', 'جائز مع عدم الأفضلية',
            ];

            return $answers[array_rand($answers)];
        }

        $wrongs = ['غير جائز', 'لا يصح', 'حرام', 'باطل', 'ممنوع', 'مفسوخ', 'ناقض', 'محظور', 'واجب', 'سنة',
            'مستحب', 'فرض عين', 'فرض كفاية', 'لا يجزئ', 'يُعاد', 'يقضى', 'يكفر', 'يأثم',
        ];

        return $wrongs[array_rand($wrongs)];
    }
}
