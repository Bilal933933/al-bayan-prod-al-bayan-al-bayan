<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'topic_id' => ['required', 'exists:topics,id'],
            'type' => ['required', 'in:mcq,true_false'],
            'text' => ['required', 'string'],
            'difficulty' => ['required', 'in:easy,medium,hard'],
            'explanation' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'options' => ['required', 'array'],
            'options.*.text' => ['required', 'string'],
            'options.*.is_correct' => ['required', 'boolean'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $options = collect($this->input('options', []));
            $correctCount = $options->where('is_correct', true)->count();

            if ($correctCount !== 1) {
                $validator->errors()->add('options', 'يجب اختيار إجابة صحيحة واحدة بالضبط.');
            }

            if ($this->input('type') === 'true_false' && $options->count() !== 2) {
                $validator->errors()->add('options', 'سؤال صح/خطأ يجب أن يحوي خيارين بالضبط.');
            }

            if ($this->input('type') === 'mcq' && $options->count() < 2) {
                $validator->errors()->add('options', 'يجب توفير خيارين على الأقل.');
            }
        });
    }
}
