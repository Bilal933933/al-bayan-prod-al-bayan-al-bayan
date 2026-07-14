<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\AnswerQuestionRequest;
use App\Models\Attempt;
use App\Models\AttemptQuestion;
use App\Models\AttemptSection;
use App\Models\Competition;
use App\Models\QuestionOption;
use App\Models\Topic;
use App\Services\AttemptCreationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class AttemptController extends Controller
{
    public function __construct(
        private readonly AttemptCreationService $attemptCreationService,
    ) {}

    public function index(Request $request): Response
    {
        $attempts = Attempt::query()
            ->where('user_id', auth()->id())
            ->with(['topic:id,name', 'competition:id,name'])
            ->when($request->filled('type'), fn ($q) => $q->where('type', $request->string('type')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return inertia('student/attempts/index', [
            'attempts' => $attempts,
            'filters' => $request->only('type'),
        ]);
    }

    public function show(Attempt $attempt): Response
    {
        abort_unless($attempt->user_id === auth()->id(), 403);

        if ($attempt->isCompleted()) {
            $attempt->load([
                'sections.questions.question.options',
                'sections.questions.selectedOption',
            ]);

            return inertia('student/attempts/show', [
                'attempt' => $attempt,
            ]);
        }

        $attempt->load([
            'sections.topic:id,name',
        ]);

        return inertia('student/attempts/take', [
            'attempt' => $attempt,
        ]);
    }

    public function section(Attempt $attempt, AttemptSection $section): JsonResponse
    {
        abort_unless($attempt->user_id === auth()->id(), 403);
        abort_unless($section->attempt_id === $attempt->id, 404);

        $section->load([
            'topic:id,name',
            'questions.question.options',
            'questions.selectedOption',
        ]);

        return response()->json($section);
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

    public function answerQuestion(AnswerQuestionRequest $request, Attempt $attempt, AttemptQuestion $attemptQuestion): RedirectResponse
    {
        abort_unless($attempt->user_id === auth()->id(), 403);

        $option = QuestionOption::findOrFail($request->validated('selected_option_id'));

        $attemptQuestion->update([
            'selected_option_id' => $option->id,
            'is_correct' => $option->is_correct,
        ]);

        return back();
    }

    public function finish(Attempt $attempt): RedirectResponse
    {
        abort_unless($attempt->user_id === auth()->id(), 403);
        abort_unless($attempt->isInProgress(), 422);

        $correctCount = AttemptQuestion::whereHas('section', fn ($q) => $q->where('attempt_id', $attempt->id))
            ->where('is_correct', true)
            ->count();

        $attempt->update([
            'status' => Attempt::STATUS_COMPLETED,
            'finished_at' => now(),
            'correct_answers' => $correctCount,
        ]);

        return redirect()->route('student.attempts.show', $attempt);
    }
}
