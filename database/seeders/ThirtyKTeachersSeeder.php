<?php

namespace Database\Seeders;

use App\Models\Competition;
use App\Models\Topic;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ThirtyKTeachersSeeder extends Seeder
{
    private const DIFFICULTY_DISTRIBUTION = ['easy' => 33, 'medium' => 34, 'hard' => 33];

    public function run(): void
    {
        DB::transaction(function () {
            $this->clearAll();

            $this->command->info('جاري إنشاء المسابقات...');
            $container = $this->createContainer();
            $children = $this->createChildren($container);

            $this->command->info('جاري إنشاء المحاور العامة...');
            $generalTopics = $this->createGeneralTopics();

            $this->command->info('جاري إنشاء المحاور التخصصية...');
            $specializedTopics = $this->createSpecializedTopics();

            $this->command->info('جاري ربط المحاور بالمسابقات...');
            $this->linkTopics($children, $generalTopics, $specializedTopics);
        });

        $this->command->info('تم إنشاء بيانات مسابقة 30 ألف معلم بنجاح!');
    }

    private function clearAll(): void
    {
        DB::table('user_scores')->delete();
        DB::table('attempt_questions')->delete();
        DB::table('attempt_sections')->delete();
        DB::table('attempts')->delete();
        DB::table('competition_user')->delete();
        DB::table('competition_topic')->delete();
        DB::table('question_options')->delete();
        DB::table('questions')->delete();
        DB::table('competitions')->whereNotNull('parent_id')->delete();
        DB::table('competitions')->delete();
        DB::table('topics')->delete();
    }

    private function createContainer(): Competition
    {
        return Competition::create([
            'classification' => 'container',
            'parent_id' => null,
            'order' => 1,
            'code' => 'T30K',
            'slug' => '30k-teachers',
            'name' => 'مسابقة 30 ألف معلم',
            'color' => '#1e40af',
            'icon' => 'graduation-cap',
            'description' => 'مسابقة تعيين 30 ألف معلم سنويًا - وزارة التربية والتعليم المصرية',
            'is_active' => true,
        ]);
    }

    private function createChildren(Competition $container): array
    {
        $childrenData = [
            ['name' => 'مسابقة اللغة العربية', 'code' => 'T30K-ARB', 'slug' => '30k-arabic', 'color' => '#b91c1c', 'icon' => 'book'],
            ['name' => 'مسابقة اللغة الإنجليزية', 'code' => 'T30K-ENG', 'slug' => '30k-english', 'color' => '#7c3aed', 'icon' => 'languages'],
            ['name' => 'مسابقة الرياضيات', 'code' => 'T30K-MATH', 'slug' => '30k-mathematics', 'color' => '#059669', 'icon' => 'sigma'],
            ['name' => 'مسابقة العلوم', 'code' => 'T30K-SCI', 'slug' => '30k-science', 'color' => '#d97706', 'icon' => 'flask'],
            ['name' => 'مسابقة الدراسات الاجتماعية', 'code' => 'T30K-SOC', 'slug' => '30k-social-studies', 'color' => '#6366f1', 'icon' => 'globe'],
            ['name' => 'مسابقة الحاسب الآلي', 'code' => 'T30K-CS', 'slug' => '30k-computer-science', 'color' => '#0891b2', 'icon' => 'monitor'],
        ];

        $children = [];

        foreach ($childrenData as $i => $data) {
            $children[] = Competition::create(array_merge($data, [
                'parent_id' => $container->id,
                'classification' => 'child',
                'order' => $i + 1,
                'description' => "مسابقة {$data['name']} ضمن مسابقة 30 ألف معلم",
                'image' => null,
                'is_active' => true,
            ]));
        }

        return $children;
    }

    private function createGeneralTopics(): array
    {
        $topicsData = [
            ['code' => 'BEH', 'name' => 'الكفايات السلوكية', 'default_questions_count' => 20, 'default_duration_minutes' => 15],
            ['code' => 'ARB', 'name' => 'اللغة العربية', 'default_questions_count' => 20, 'default_duration_minutes' => 15],
            ['code' => 'ENG', 'name' => 'اللغة الإنجليزية', 'default_questions_count' => 20, 'default_duration_minutes' => 15],
            ['code' => 'CS', 'name' => 'الحاسب الآلي', 'default_questions_count' => 20, 'default_duration_minutes' => 15],
            ['code' => 'CUL', 'name' => 'الثقافة العامة', 'default_questions_count' => 20, 'default_duration_minutes' => 15],
            ['code' => 'EDU', 'name' => 'الكفايات التربوية', 'default_questions_count' => 30, 'default_duration_minutes' => 20],
        ];

        $topics = [];

        foreach ($topicsData as $data) {
            $topics[] = Topic::create(array_merge($data, [
                'visibility' => 'general',
                'description' => "محور {$data['name']} - مسابقة 30 ألف معلم",
                'is_active' => true,
            ]));
        }

        return $topics;
    }

    private function createSpecializedTopics(): array
    {
        $topicsData = [
            ['code' => 'ARB-SPEC', 'name' => 'الكفايات التخصصية (عربي)', 'default_questions_count' => 50, 'default_duration_minutes' => 30],
            ['code' => 'ENG-SPEC', 'name' => 'الكفايات التخصصية (إنجليزي)', 'default_questions_count' => 50, 'default_duration_minutes' => 30],
            ['code' => 'MATH-SPEC', 'name' => 'الكفايات التخصصية (رياضيات)', 'default_questions_count' => 50, 'default_duration_minutes' => 30],
            ['code' => 'SCI-SPEC', 'name' => 'الكفايات التخصصية (علوم)', 'default_questions_count' => 50, 'default_duration_minutes' => 30],
            ['code' => 'SOC-SPEC', 'name' => 'الكفايات التخصصية (دراسات اجتماعية)', 'default_questions_count' => 50, 'default_duration_minutes' => 30],
            ['code' => 'CS-SPEC', 'name' => 'الكفايات التخصصية (حاسب آلي)', 'default_questions_count' => 50, 'default_duration_minutes' => 30],
        ];

        $topics = [];

        foreach ($topicsData as $data) {
            $topics[] = Topic::create(array_merge($data, [
                'visibility' => 'general',
                'description' => "محور {$data['name']} - مسابقة 30 ألف معلم",
                'is_active' => true,
            ]));
        }

        return $topics;
    }

    private function linkTopics(array $children, array $generalTopics, array $specializedTopics): void
    {
        $pivotDefaults = [
            'questions_count' => 20,
            'duration_minutes' => 15,
            'difficulty_distribution' => json_encode(self::DIFFICULTY_DISTRIBUTION),
        ];

        $specializedMap = [
            'T30K-ARB' => 'ARB-SPEC',
            'T30K-ENG' => 'ENG-SPEC',
            'T30K-MATH' => 'MATH-SPEC',
            'T30K-SCI' => 'SCI-SPEC',
            'T30K-SOC' => 'SOC-SPEC',
            'T30K-CS' => 'CS-SPEC',
        ];

        $countsByTopicCode = [
            'BEH' => ['questions_count' => 20, 'duration_minutes' => 15],
            'ARB' => ['questions_count' => 20, 'duration_minutes' => 15],
            'ENG' => ['questions_count' => 20, 'duration_minutes' => 15],
            'CS' => ['questions_count' => 20, 'duration_minutes' => 15],
            'CUL' => ['questions_count' => 20, 'duration_minutes' => 15],
            'EDU' => ['questions_count' => 30, 'duration_minutes' => 20],
        ];

        $generalByCode = [];
        foreach ($generalTopics as $t) {
            $generalByCode[$t->code] = $t;
        }

        $specByCode = [];
        foreach ($specializedTopics as $t) {
            $specByCode[$t->code] = $t;
        }

        $rows = [];

        foreach ($children as $child) {
            $code = $child->code;

            // Link general topics to this child
            foreach ($generalByCode as $tCode => $topic) {
                $counts = $countsByTopicCode[$tCode];
                $rows[] = [
                    'competition_id' => $child->id,
                    'topic_id' => $topic->id,
                    'questions_count' => $counts['questions_count'],
                    'duration_minutes' => $counts['duration_minutes'],
                    'difficulty_distribution' => json_encode(self::DIFFICULTY_DISTRIBUTION),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Link specialized topic
            $specCode = $specializedMap[$code];
            $specTopic = $specByCode[$specCode];
            $rows[] = [
                'competition_id' => $child->id,
                'topic_id' => $specTopic->id,
                'questions_count' => 50,
                'duration_minutes' => 30,
                'difficulty_distribution' => json_encode(self::DIFFICULTY_DISTRIBUTION),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach (array_chunk($rows, 50) as $chunk) {
            DB::table('competition_topic')->insert($chunk);
        }
    }
}
