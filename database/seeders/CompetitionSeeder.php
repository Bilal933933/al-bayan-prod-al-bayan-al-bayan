<?php

namespace Database\Seeders;

use App\Models\Competition;
use Illuminate\Database\Seeder;

class CompetitionSeeder extends Seeder
{
    public function run(): void
    {
        $containers = [
            [
                'name' => 'المسابقات العلمية',
                'code' => 'SCI',
                'slug' => 'scientific',
                'color' => '#2563eb',
                'icon' => 'graduation-cap',
                'children' => [
                    ['name' => 'مسابقة الرياضيات', 'code' => 'MATH', 'slug' => 'mathematics', 'color' => '#059669', 'icon' => 'sigma'],
                    ['name' => 'مسابقة الفيزياء', 'code' => 'PHY', 'slug' => 'physics', 'color' => '#d97706', 'icon' => 'zap'],
                    ['name' => 'مسابقة الكيمياء', 'code' => 'CHEM', 'slug' => 'chemistry', 'color' => '#7c3aed', 'icon' => 'flame'],
                    ['name' => 'مسابقة الأحياء', 'code' => 'BIO', 'slug' => 'biology', 'color' => '#0891b2', 'icon' => 'leaf'],
                ],
            ],
            [
                'name' => 'المسابقات الدينية',
                'code' => 'REL',
                'slug' => 'religious',
                'color' => '#16a34a',
                'icon' => 'book-open',
                'children' => [
                    ['name' => 'مسابقة القرآن الكريم', 'code' => 'QUR', 'slug' => 'quran', 'color' => '#15803d', 'icon' => 'book'],
                    ['name' => 'مسابقة الحديث الشريف', 'code' => 'HAD', 'slug' => 'hadith', 'color' => '#166534', 'icon' => 'book-open'],
                    ['name' => 'مسابقة الفقه', 'code' => 'FIQ', 'slug' => 'fiqh', 'color' => '#14532d', 'icon' => 'scale'],
                ],
            ],
            [
                'name' => 'المسابقات اللغوية',
                'code' => 'LNG',
                'slug' => 'linguistic',
                'color' => '#dc2626',
                'icon' => 'book-open',
                'children' => [
                    ['name' => 'مسابقة اللغة العربية', 'code' => 'ARB', 'slug' => 'arabic', 'color' => '#b91c1c', 'icon' => 'book'],
                    ['name' => 'مسابقة اللغة الإنجليزية', 'code' => 'ENG', 'slug' => 'english', 'color' => '#991b1b', 'icon' => 'languages'],
                    ['name' => 'مسابقة البلاغة', 'code' => 'BAL', 'slug' => 'balagha', 'color' => '#7f1d1d', 'icon' => 'pen-tool'],
                ],
            ],
            [
                'name' => 'المسابقات التقنية',
                'code' => 'TEC',
                'slug' => 'technical',
                'color' => '#0d9488',
                'icon' => 'monitor',
                'children' => [
                    ['name' => 'مسابقة البرمجة', 'code' => 'PRO', 'slug' => 'programming', 'color' => '#0f766e', 'icon' => 'code'],
                    ['name' => 'مسابقة الأمن السيبراني', 'code' => 'SEC', 'slug' => 'cybersecurity', 'color' => '#115e59', 'icon' => 'shield'],
                ],
            ],
        ];

        $order = 0;

        foreach ($containers as $containerData) {
            $children = $containerData['children'];
            unset($containerData['children']);

            $order++;

            $parent = Competition::create(array_merge($containerData, [
                'classification' => 'container',
                'order' => $order,
                'is_active' => true,
                'description' => "مسابقة {$containerData['name']} - إحدى مسابقات منصة البيان",
                'image' => null,
            ]));

            foreach ($children as $i => $childData) {
                Competition::create(array_merge($childData, [
                    'parent_id' => $parent->id,
                    'classification' => 'child',
                    'is_active' => true,
                    'order' => $i + 1,
                    'description' => "مسابقة {$childData['name']} ضمن {$containerData['name']}",
                    'image' => null,
                ]));
            }
        }

        $standalones = [
            ['name' => 'مسابقة المعلومات العامة', 'code' => 'GEN', 'slug' => 'general', 'color' => '#6366f1', 'icon' => 'star'],
            ['name' => 'مسابقة الذكاء الاصطناعي', 'code' => 'AI', 'slug' => 'artificial-intelligence', 'color' => '#ec4899', 'icon' => 'brain'],
            ['name' => 'مسابقة التاريخ الإسلامي', 'code' => 'HIS', 'slug' => 'islamic-history', 'color' => '#f59e0b', 'icon' => 'book-open'],
            ['name' => 'مسابقة الجغرافيا', 'code' => 'GEO', 'slug' => 'geography', 'color' => '#10b981', 'icon' => 'globe'],
            ['name' => 'مسابقة الثقافة الصحية', 'code' => 'HLT', 'slug' => 'health', 'color' => '#ef4444', 'icon' => 'heart'],
            ['name' => 'مسابقة الفنون والتصميم', 'code' => 'ART', 'slug' => 'arts', 'color' => '#f97316', 'icon' => 'palette'],
            ['name' => 'مسابقة الاقتصاد والمال', 'code' => 'ECO', 'slug' => 'economics', 'color' => '#14b8a6', 'icon' => 'target'],
            ['name' => 'مسابقة الفلسفة والمنطق', 'code' => 'PHL', 'slug' => 'philosophy', 'color' => '#8b5cf6', 'icon' => 'award'],
            ['name' => 'مسابقة الفلك والفضاء', 'code' => 'AST', 'slug' => 'astronomy', 'color' => '#0ea5e9', 'icon' => 'star'],
            ['name' => 'مسابقة المهارات الرقمية', 'code' => 'DIG', 'slug' => 'digital-skills', 'color' => '#84cc16', 'icon' => 'clipboard-list'],
        ];

        foreach ($standalones as $i => $data) {
            Competition::create(array_merge($data, [
                'classification' => 'standalone',
                'parent_id' => null,
                'order' => $order + $i + 1,
                'is_active' => true,
                'description' => "مسابقة {$data['name']} - مسابقة مستقلة",
                'image' => null,
            ]));
        }
    }
}
