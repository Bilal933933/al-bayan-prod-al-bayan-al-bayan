<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Competition;
use App\Models\Topic;
use App\Services\AttemptCreationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class AttemptController extends Controller
{
    public function __construct(
        private readonly AttemptCreationService $attemptCreationService,
    ) {}

    public function show(Attempt $attempt): Response
    {
        $attempt->load(['sections.questions.question.options']);

        return inertia('student/attempts/show', [
            'attempt' => $attempt,
        ]);
    }

    public function startPractice(Topic $topic): RedirectResponse
    {
        abort_unless($topic->is_active, 404);

        $attempt = $this->attemptCreationService->createPractice(
            auth()->user(),
            $topic,
        );

        return redirect()->route('student.attempts.show', $attempt);
    }

    public function startExam(Competition $competition): RedirectResponse
    {
        abort_unless(! $competition->isContainer(), 403);
        abort_unless(
            $competition->topics()->where('topics.is_active', true)->exists(),
            422,
            'No active topics available for this competition.',
        );

        $attempt = $this->attemptCreationService->createExam(
            auth()->user(),
            $competition,
        );

        return redirect()->route('student.attempts.show', $attempt);
    }
}
