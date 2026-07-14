<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTopicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:255', 'unique:topics,code'],
            'name' => ['required', 'string', 'max:255'],
            'visibility' => ['required', 'string', 'in:general,private'],
            'description' => ['nullable', 'string'],
            'default_questions_count' => ['required', 'integer', 'min:1'],
            'default_duration_minutes' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
        ];
    }
}
