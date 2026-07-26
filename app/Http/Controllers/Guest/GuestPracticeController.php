<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionOptionsResource;
use App\Models\Question;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Response;

class GuestPracticeController extends Controller
{
    const int QUESTIONS_COUNT = 3;

    const int RATE_LIMIT_ATTEMPTS = 10;

    const int RATE_LIMIT_DECAY_SECONDS = 3600;

    public function show(): Response
    {
        $topic = Topic::active()->general()
            ->whereHas('questions', fn ($q) => $q->active())
            ->inRandomOrder()
            ->first();

        if (! $topic) {
            return inertia('guest/practice', [
                'topic' => null,
                'questions' => [],
                'error' => 'لا توجد أسئلة تجريبية متاحة حالياً.',
            ]);
        }

        $questions = $topic->questions()
            ->active()
            ->inRandomOrder()
            ->take(self::QUESTIONS_COUNT)
            ->get();

        $questions->load('options');

        $questionsResource = $questions->map(fn (Question $q) => [
            'id' => $q->id,
            'text' => $q->text,
            'type' => $q->type,
            'difficulty' => $q->difficulty,
            'options' => QuestionOptionsResource::collection($q->options)->resolve(),
        ]);

        return inertia('guest/practice', [
            'topic' => ['id' => $topic->id, 'name' => $topic->name],
            'questions' => $questionsResource,
            'error' => null,
        ]);
    }

    public function check(Request $request, Topic $topic): JsonResponse
    {
        abort_unless($topic->is_active && $topic->isGeneral(), 404);

        $rateLimitKey = 'guest-practice:'.$request->ip();

        $executed = RateLimiter::attempt(
            $rateLimitKey,
            self::RATE_LIMIT_ATTEMPTS,
            fn () => null,
            self::RATE_LIMIT_DECAY_SECONDS,
        );

        if (! $executed) {
            abort(429, 'لقد تجاوزت الحد المسموح من المحاولات. حاول مرة أخرى بعد ساعة.');
        }

        $validated = $request->validate([
            'answers' => ['required', 'array', 'min:1', 'max:'.self::QUESTIONS_COUNT],
            'answers.*.question_id' => ['required', 'integer', 'exists:questions,id'],
            'answers.*.selected_option_id' => ['required', 'integer', 'exists:question_options,id'],
        ]);

        $questionIds = collect($validated['answers'])->pluck('question_id')->unique();
        $questions = Question::whereIn('id', $questionIds)->with('options')->get()->keyBy('id');

        $details = [];

        foreach ($validated['answers'] as $answer) {
            $question = $questions->get($answer['question_id']);

            if (! $question || $question->topic_id !== $topic->id) {
                continue;
            }

            $option = $question->options->firstWhere('id', $answer['selected_option_id']);
            $correctOption = $question->options->firstWhere('is_correct', true);

            $details[] = [
                'question_id' => $answer['question_id'],
                'selected_option_id' => $answer['selected_option_id'],
                'correct_option_id' => $correctOption?->id,
                'is_correct' => $option?->is_correct ?? false,
            ];
        }

        $total = count($details);
        $correct = count(array_filter($details, fn ($d) => $d['is_correct']));

        return response()->json([
            'total' => $total,
            'correct' => $correct,
            'details' => $details,
        ]);
    }
}
