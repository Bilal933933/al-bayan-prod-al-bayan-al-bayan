<?php

namespace App\Http\Requests\Student;

use App\Models\QuestionOption;
use Illuminate\Foundation\Http\FormRequest;

class AnswerQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'selected_option_id' => ['required', 'exists:question_options,id'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $attemptQuestion = $this->route('attemptQuestion');
            $attempt = $attemptQuestion->section->attempt;

            if ($attempt->user_id !== $this->user()->id) {
                abort(403);
            }

            if (! $attempt->isInProgress()) {
                $validator->errors()->add('attempt', 'لا يمكن تعديل إجابة لمحاولة منتهية.');

                return;
            }

            $option = QuestionOption::find($this->input('selected_option_id'));
            if ($option?->question_id !== $attemptQuestion->question_id) {
                $validator->errors()->add('selected_option_id', 'الخيار لا ينتمي لهذا السؤال.');

                return;
            }

            if ($attempt->isExam() && $attemptQuestion->selected_option_id !== null) {
                $validator->errors()->add('attempt', 'لا يمكن تغيير الإجابة في وضع المحاكاة.');
            }
        });
    }
}
