<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Competition;
use Illuminate\Http\Request;

class CompetitionController extends Controller
{
    public function index(Request $request)
    {
        $classification = $request->query('classification');

        $competitions = Competition::query()
            ->active()
            ->when(
                $classification && in_array($classification, [
                    Competition::CLASSIFICATION_CONTAINER,
                    Competition::CLASSIFICATION_STANDALONE,
                    Competition::CLASSIFICATION_CHILD,
                ]),
                fn ($query) => $query->where('classification', $classification)
            )
            ->when(
                ! $classification,
                fn ($query) => $query->roots() // بدون فلتر، نعرض المستوى الأعلى فقط افتراضيًا
            )
            ->withCount('children')
            ->orderBy('order')
            ->get();

        return inertia('student/competitions/index', [
            'competitions' => $competitions,
            'filters' => [
                'classification' => $classification,
            ],
        ]);
    }

    public function show(Competition $competition)
    {
        abort_unless($competition->is_active, 404);

        $competition->loadMissing('parent');

        if ($competition->isContainer()) {
            $children = $competition->children()
                ->active()
                ->withCount('children')
                ->orderBy('order')
                ->get();

            return inertia('student/competitions/show', [
                'competition' => $competition,
                'children' => $children,
            ]);
        }

        // المسابقة مستقلة أو ابن (standalone/child) — قابلة لبدء اختبار
        return inertia('student/competitions/show', [
            'competition' => $competition,
            // 'topics' => $competition->topics()->with(...)->get(), ← لاحقًا عند بناء جدول topics
        ]);
    }
}
