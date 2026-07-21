<?php

namespace Database\Seeders;

use App\Models\Competition;
use Illuminate\Database\Seeder;

class CompetitionSeeder extends Seeder
{
    public function run(): void
    {
        $order = 0;

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
                ],
            ],
        ];

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
