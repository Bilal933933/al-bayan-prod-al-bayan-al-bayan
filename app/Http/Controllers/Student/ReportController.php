<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AttemptQuestion;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        /** @var User */
        $user = auth()->user();

        $reports = Report::query()
            ->where('user_id', $user->id)
            ->with('question:id,text')
            ->latest()
            ->get()
            ->map(fn (Report $r) => [
                'id' => $r->id,
                'type' => $r->type,
                'description' => $r->description,
                'status' => $r->status,
                'question' => $r->question ? [
                    'id' => $r->question->id,
                    'text' => $r->question->text,
                ] : null,
                'created_at' => $r->created_at,
            ]);

        $recentQuestions = AttemptQuestion::query()
            ->whereHas('section.attempt', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->with('question:id,text')
            ->latest()
            ->limit(50)
            ->get()
            ->unique('question_id')
            ->take(20)
            ->map(fn (AttemptQuestion $aq) => [
                'id' => $aq->question_id,
                'text' => mb_substr($aq->question->text, 0, 120),
            ])
            ->values();

        return inertia('student/report', [
            'reports' => $reports,
            'recent_questions' => $recentQuestions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'in:wrong_answer,text_error,inappropriate_content,technical,suggestion,other'],
            'question_id' => ['nullable', 'integer', 'exists:questions,id'],
            'description' => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        /** @var User */
        $user = auth()->user();

        Report::create([
            'user_id' => $user->id,
            'question_id' => $validated['question_id'] ?? null,
            'type' => $validated['type'],
            'description' => $validated['description'],
        ]);

        return to_route('student.report');
    }
}
