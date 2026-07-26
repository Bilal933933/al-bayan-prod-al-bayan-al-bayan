<?php

namespace App\Http\Controllers\Student;

use App\Contracts\Services\AttemptCreationServiceInterface;
use App\Contracts\Services\ExamGradingServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Student\AnswerQuestionRequest;
use App\Http\Requests\Student\StartPracticeRequest;
use App\Http\Resources\QuestionOptionsResource;
use App\Models\Attempt;
use App\Models\AttemptQuestion;
use App\Models\AttemptSection;
use App\Models\Competition;
use App\Models\QuestionOption;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Response;

class AttemptController extends Controller
{
    public function __construct(
        private readonly AttemptCreationServiceInterface $attemptCreationService,
        private readonly ExamGradingServiceInterface $gradingService,
    ) {}

    public function index(Request $request): Response
    {
        $userId = auth()->id();

        $attempts = Attempt::query()
            ->where('user_id', $userId)
            ->with(['topic:id,name', 'competition:id,name', 'sections' => fn ($q) => $q->select(['id', 'attempt_id', 'submitted_at', 'order', 'questions_count'])])
            ->when($request->filled('type'), fn ($q) => $q->where('type', $request->string('type')))
            ->latest()
            ->paginate(Attempt::PAGINATION)
            ->withQueryString();

        $stats = Attempt::where('user_id', $userId)->toBase()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed")
            ->selectRaw("SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress")
            ->selectRaw("AVG(CASE WHEN status = 'completed' AND score_percentage IS NOT NULL THEN score_percentage ELSE NULL END) as average_percentage")
            ->first();

        return inertia('student/attempts/index', [
            'attempts' => $attempts,
            'filters' => $request->only('type'),
            'stats' => $stats,
        ]);
    }

    public function create(Request $request): Response
    {
        $topics = Topic::active()
            ->get(['id', 'name', 'default_questions_count', 'default_duration_minutes']);

        $competitions = Competition::active()
            ->roots()
            ->with(['children' => fn ($q) => $q->active()])
            ->get(['id', 'name', 'slug', 'classification', 'description']);

        $topicId = $request->query('topic');

        if ($topicId && $topics->contains('id', (int) $topicId)) {
            $topicId = (int) $topicId;
        } else {
            $topicId = null;
        }

        return inertia('student/attempts/create', [
            'topics' => $topics,
            'competitions' => $competitions,
            'topicId' => $topicId,
        ]);
    }

    public function show(Attempt $attempt): Response
    {
        $this->authorize('view', $attempt);
        $this->gradingService->handleExpiredSections($attempt);

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
        $this->authorize('view', $attempt);
        abort_unless($section->attempt_id === $attempt->id, 404);

        $this->gradingService->handleExpiredSections($attempt);

        if ($section->started_at === null) {
            $section->updateQuietly(['started_at' => now()]);
        }

        $section->load([
            'topic:id,name',
            'questions.question.options',
            'questions.selectedOption',
        ]);

        $data = $section->toArray();

        foreach ($data['questions'] as $i => $aq) {
            $question = $section->questions[$i]->question;
            $data['questions'][$i]['question']['options'] = QuestionOptionsResource::collection(
                $question->options,
            )->resolve();
        }

        return response()->json($data);
    }

    public function startPractice(StartPracticeRequest $request, Topic $topic): RedirectResponse
    {
        $attempt = $this->attemptCreationService->createPractice(
            auth()->user(),
            $topic,
            $request->validated('difficulty'),
            $request->validated('questions_count'),
            $request->validated('with_timer') ?? true,
        );

        return redirect()->route('student.attempts.show', $attempt);
    }

    public function startExam(Competition $competition): RedirectResponse
    {
        abort_unless(! $competition->isContainer(), 403);
        abort_if($competition->isUpcoming(), 403, 'المسابقة لم تبدأ بعد.');
        abort_if($competition->isEnded(), 403, 'المسابقة انتهت.');
        abort_unless(
            $competition->topics()->where('topics.is_active', true)->exists(),
            422,
            'لا توجد محاور مفعلة لهذه المسابقة.',
        );

        $competition->load(['topics' => fn ($q) => $q->where('topics.is_active', true)]);
        $insufficientTopics = $competition->topics->filter(function ($topic) {
            $expected = $topic->pivot->questions_count;
            $available = $topic->questions()->active()->count();

            return $available < $expected;
        });

        if ($insufficientTopics->isNotEmpty()) {
            $details = $insufficientTopics->map(fn ($t) => "{$t->name} (متاح {$t->questions()->active()->count()} من {$t->pivot->questions_count})")->join('، ');

            throw ValidationException::withMessages([
                'competition' => "المحاور التالية لا تحتوي على عدد كافٍ من الأسئلة: {$details}.",
            ]);
        }

        abort_unless(
            auth()->user()->competitions()
                ->where('competition_id', $competition->getRootId())
                ->exists(),
            403,
            'يجب عليك الانضمام إلى المسابقة أولاً.',
        );

        $attempt = $this->attemptCreationService->createExam(
            auth()->user(),
            $competition,
        );

        return redirect()->route('student.attempts.show', $attempt);
    }

    public function answerQuestion(AnswerQuestionRequest $request, Attempt $attempt, AttemptQuestion $attemptQuestion): RedirectResponse
    {
        $this->authorize('view', $attempt);
        abort_unless($attemptQuestion->section->attempt_id === $attempt->id, 404);

        $this->gradingService->handleExpiredSections($attempt);

        $option = QuestionOption::findOrFail((int) $request->validated('selected_option_id'));
        abort_unless($option->question_id === $attemptQuestion->question_id, 422);

        $isNewAnswer = $attemptQuestion->selected_option_id === null;

        $attemptQuestion->update([
            'selected_option_id' => $option->id,
            'is_correct' => $option->is_correct,
        ]);

        if ($isNewAnswer) {
            $attempt->increment('answered_count');
        }

        return back();
    }

    public function submitSection(Attempt $attempt, AttemptSection $section): RedirectResponse
    {
        $this->authorize('view', $attempt);
        abort_unless($section->attempt_id === $attempt->id, 404);
        abort_unless($attempt->isInProgress(), 422);

        $this->gradingService->handleExpiredSections($attempt);

        abort_if($section->isSubmitted(), 422, 'هذا القسم تم تسليمه بالفعل أو انتهى وقته.');

        DB::transaction(function () use ($attempt, $section) {
            $section->update(['submitted_at' => now()]);

            $allSubmitted = $attempt->sections()->whereNull('submitted_at')->doesntExist();

            if ($allSubmitted) {
                $this->gradingService->finalizeAttempt($attempt);
            }
        });

        return back();
    }

    public function finish(Attempt $attempt): RedirectResponse
    {
        $this->authorize('view', $attempt);
        abort_unless($attempt->isInProgress(), 422);

        $this->gradingService->handleExpiredSections($attempt);

        if ($attempt->isCompleted()) {
            return redirect()->route('student.attempts.show', $attempt);
        }

        DB::transaction(function () use ($attempt) {
            $this->gradingService->finalizeAttempt($attempt);

            if ($attempt->isExam()) {
                AttemptSection::where('attempt_id', $attempt->id)
                    ->whereNull('submitted_at')
                    ->update(['submitted_at' => now()]);
            }
        });

        return redirect()->route('student.attempts.show', $attempt);
    }
}
