<?php

namespace App\Http\Requests\Student;

use App\Models\Attempt;
use App\Models\Question;
use App\Models\Topic;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StartPracticeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'difficulty' => [
                'nullable',
                'string',
                Rule::in([Question::DIFFICULTY_EASY, Question::DIFFICULTY_MEDIUM, Question::DIFFICULTY_HARD]),
            ],
            'questions_count' => ['nullable', 'integer', 'min:5', 'max:50'],
            'with_timer' => ['nullable', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $topic = $this->route('topic');

            if (! $topic instanceof Topic) {
                abort(404);
            }

            if (! $topic->is_active) {
                abort(404);
            }

            if ($topic->default_questions_count <= 0) {
                $validator->errors()->add('topic', 'هذا المحور غير مهيّأ للتدريب.');

                return;
            }

            if ($topic->questions()->active()->doesntExist()) {
                $validator->errors()->add('topic', 'لا توجد أسئلة متاحة في هذا المحور.');

                return;
            }

            $requestedCount = (int) ($this->input('questions_count') ?? $topic->default_questions_count);
            $difficulty = $this->input('difficulty');

            $availableQuery = $topic->questions()->active();

            if ($difficulty !== null) {
                $availableQuery->where('difficulty', $difficulty);
            }

            $availableCount = $availableQuery->count();

            if ($availableCount < $requestedCount) {
                $validator->errors()->add('questions_count',
                    "عدد الأسئلة المتاحة ($availableCount) أقل من العدد المطلوب ($requestedCount). اختر عدداً أقل أو غيّر مستوى الصعوبة.",
                );

                return;
            }

            if (Attempt::where('user_id', $this->user()?->id)
                ->where('topic_id', $topic->id)
                ->where('status', Attempt::STATUS_IN_PROGRESS)
                ->exists()
            ) {
                $validator->errors()->add('attempt', 'لديك بالفعل محاولة تدريب قيد التنفيذ لهذا المحور.');
            }
        });
    }
}
