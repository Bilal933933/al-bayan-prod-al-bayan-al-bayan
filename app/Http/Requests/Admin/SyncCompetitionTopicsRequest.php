<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SyncCompetitionTopicsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'topics' => ['required', 'array'],
            'topics.*.topic_id' => ['required', 'exists:topics,id'],
            'topics.*.questions_count' => ['required', 'integer', 'min:1'],
            'topics.*.duration_minutes' => ['required', 'integer', 'min:1'],
            'topics.*.difficulty_distribution' => ['nullable', 'array'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $competition = $this->route('competition');

            if (! $competition->canHaveTopics()) {
                $validator->errors()->add('topics', 'لا يمكن ربط محاور بمسابقة حاوية.');
            }
        });
    }
}
