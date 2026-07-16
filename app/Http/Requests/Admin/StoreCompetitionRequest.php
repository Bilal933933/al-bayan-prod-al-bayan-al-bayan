<?php

namespace App\Http\Requests\Admin;

use App\Models\Competition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreCompetitionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'parent_id' => ['nullable', 'exists:competitions,id'],
            'classification' => ['required', 'string', 'in:container,standalone,child'],
            'code' => ['required', 'string', 'max:255', 'unique:competitions,code'],
            'name' => ['required', 'string', 'max:255'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'image' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:20'],
            'icon' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $classification = $this->input('classification');
            $parentId = $this->input('parent_id');

            if ($classification === 'container' && $parentId) {
                $validator->errors()->add(
                    'parent_id',
                    'الحاوية لا يمكن أن تتبع حاوية أخرى.'
                );
            }

            if ($classification === 'child' && ! $parentId) {
                $validator->errors()->add(
                    'parent_id',
                    'المسابقة من نوع "ابن" يجب أن تختار أباً.'
                );
            }

            if ($parentId) {
                $parent = Competition::find((int) $parentId);

                if ($parent && ! $parent->isContainer()) {
                    $validator->errors()->add(
                        'parent_id',
                        'لا يمكن اختيار هذه المسابقة كأب لأنها ليست حاوية.'
                    );
                }
            }
        });
    }
}
