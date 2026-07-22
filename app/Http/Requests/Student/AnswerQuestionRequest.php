<?php

namespace App\Http\Requests\Student;

use App\Models\Attempt;
use App\Models\AttemptQuestion;
use App\Models\QuestionOption;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AnswerQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'selected_option_id' => ['required', 'exists:question_options,id'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $attemptQuestion = $this->route('attemptQuestion');

            if (! $attemptQuestion instanceof AttemptQuestion) {
                abort(404);
            }

            $attempt = $attemptQuestion->section->attempt;

            if (! $attempt instanceof Attempt) {
                abort(404);
            }

            if ($attempt->user_id !== $this->user()?->id) {
                abort(403);
            }

            if (! $attempt->isInProgress()) {
                $validator->errors()->add('attempt', 'لا يمكن تعديل إجابة لمحاولة منتهية.');

                return;
            }

            $section = $attemptQuestion->section;

            if ($section->submitted_at !== null) {
                $validator->errors()->add('attempt', 'لا يمكن تعديل إجابة لقسم تم تسليمه.');

                return;
            }

            if ($section->isExpired()) {
                $validator->errors()->add('attempt', 'لا يمكن تعديل إجابة لقسم انتهى وقته.');

                return;
            }

            $option = QuestionOption::find((int) $this->input('selected_option_id'));
            if ($option?->getAttribute('question_id') !== $attemptQuestion->getAttribute('question_id')) {
                $validator->errors()->add('selected_option_id', 'الخيار لا ينتمي لهذا السؤال.');

                return;
            }

            if ($attempt->isExam() && $attemptQuestion->getAttribute('selected_option_id') !== null) {
                $validator->errors()->add('attempt', 'لا يمكن تغيير الإجابة في وضع المحاكاة.');
            }
        });
    }
}
