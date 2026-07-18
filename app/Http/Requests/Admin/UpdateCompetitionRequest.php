<?php

namespace App\Http\Requests\Admin;

use App\Models\Competition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateCompetitionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $competition = $this->route('competition');
        $competitionId = $competition instanceof Competition ? $competition->id : null;
        $slugUnique = 'unique:competitions,slug'.($competitionId ? ','.$competitionId : '');

        return [
            'parent_id' => ['nullable', 'exists:competitions,id'],
            'classification' => ['required', 'string', 'in:container,standalone,child'],
            'code' => ['required', 'string', 'max:255', 'unique:competitions,code,'.($competitionId ?: '')],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', $slugUnique, 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'image' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:20'],
            'icon' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $competition = $this->route('competition');
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

            if ($competition instanceof Competition && $classification !== 'container' && $competition->children()->exists()) {
                $validator->errors()->add(
                    'classification',
                    'لا يمكن إزالة صفة الحاوية عن مسابقة لها أبناء.'
                );
            }
        });
    }
}
