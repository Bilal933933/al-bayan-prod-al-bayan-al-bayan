<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\AnswerQuestionRequest;
use App\Http\Requests\Student\StartPracticeRequest;
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
        $userId = auth()->id();

        $attempts = Attempt::query()
            ->where('user_id', $userId)
            ->with(['topic:id,name', 'competition:id,name', 'sections' => fn ($q) => $q->select(['id', 'attempt_id', 'submitted_at', 'order', 'questions_count'])])
            ->when($request->filled('type'), fn ($q) => $q->where('type', $request->string('type')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $allUserAttempts = Attempt::where('user_id', $userId);

        $stats = [
            'total' => (clone $allUserAttempts)->count(),
            'completed' => (clone $allUserAttempts)->where('status', Attempt::STATUS_COMPLETED)->count(),
            'in_progress' => (clone $allUserAttempts)->where('status', Attempt::STATUS_IN_PROGRESS)->count(),
            'average_percentage' => (function () use ($allUserAttempts) {
                $completed = (clone $allUserAttempts)->where('status', Attempt::STATUS_COMPLETED)->get();

                if ($completed->isEmpty()) {
                    return null;
                }

                return round(
                    $completed->sum('correct_answers') / max($completed->sum('total_questions'), 1) * 100,
                );
            })(),
        ];

        return inertia('student/attempts/index', [
            'attempts' => $attempts,
            'filters' => $request->only('type'),
            'stats' => $stats,
        ]);
    }

    public function create(Request $request): Response
    {
        $topics = Topic::active()
            ->whereHas('questions')
            ->get(['id', 'name']);

        $competitions = Competition::active()
            ->roots()
            ->with(['children' => fn ($q) => $q->active()])
            ->get(['id', 'name', 'classification', 'description']);

        return inertia('student/attempts/create', [
            'topics' => $topics,
            'competitions' => $competitions,
        ]);
    }

    public function show(Attempt $attempt): Response
    {
        abort_unless($attempt->user_id === auth()->id(), 403);

        if ($attempt->isCompleted()) {
            $attempt->load([
                'sections' => fn ($q) => $q->orderBy('order'),
                'sections.topic:id,name',
                'sections.questions.question.options',
                'sections.questions.selectedOption',
                'topic:id,name',
                'competition:id,name',
            ]);

            return inertia('student/attempts/show', [
                'attempt' => $attempt,
            ]);
        }

        $attempt->load([
            'sections' => fn ($q) => $q->orderBy('order'),
            'sections.topic:id,name',
            'topic:id,name',
            'competition:id,name',
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

    public function startPractice(StartPracticeRequest $request, Topic $topic): RedirectResponse
    {
        $attempt = $this->attemptCreationService->createPractice(
            auth()->user(),
            $topic,
            $request->validated('difficulty'),
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
        abort_if(
            Attempt::where('user_id', auth()->id())
                ->where('competition_id', $competition->id)
                ->where('status', Attempt::STATUS_IN_PROGRESS)
                ->exists(),
            422,
            'You already have an in-progress attempt for this competition.',
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

        $option = QuestionOption::findOrFail((int) $request->validated('selected_option_id'));

        $attemptQuestion->update([
            'selected_option_id' => $option->id,
            'is_correct' => $option->is_correct,
        ]);

        return back();
    }

    public function submitSection(Attempt $attempt, AttemptSection $section): RedirectResponse
    {
        abort_unless($attempt->user_id === auth()->id(), 403);
        abort_unless($section->attempt_id === $attempt->id, 404);
        abort_unless($attempt->isInProgress(), 422);
        abort_if($section->isSubmitted(), 422);

        $section->update(['submitted_at' => now()]);

        $allSubmitted = $attempt->sections()->whereNull('submitted_at')->doesntExist();

        if ($allSubmitted) {
            $correctCount = AttemptQuestion::whereHas('section', fn ($q) => $q->where('attempt_id', $attempt->id))
                ->where('is_correct', true)
                ->count();

            $attempt->update([
                'status' => Attempt::STATUS_COMPLETED,
                'finished_at' => now(),
                'correct_answers' => $correctCount,
            ]);
        }

        return redirect()->route('student.attempts.show', $attempt);
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

        if ($attempt->isExam()) {
            $attempt->sections()->whereNull('submitted_at')->update(['submitted_at' => now()]);
        }

        return redirect()->route('student.attempts.show', $attempt);
    }
}
