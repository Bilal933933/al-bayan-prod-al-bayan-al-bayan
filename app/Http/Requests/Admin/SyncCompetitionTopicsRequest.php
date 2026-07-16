<?php

namespace App\Http\Requests\Admin;

use App\Models\Competition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SyncCompetitionTopicsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
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

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $competition = $this->route('competition');

            if ($competition instanceof Competition && ! $competition->can_have_topics) {
                $validator->errors()->add('topics', 'لا يمكن ربط محاور بمسابقة حاوية.');
            }
        });
    }
}
