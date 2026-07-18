<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $student = $this->route('student');
        $studentId = $student instanceof User ? $student->id : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.($studentId ?: '')],
            'password' => ['nullable', 'string', 'min:8'],
            'email_verified_at' => ['nullable', 'date'],
        ];
    }
}
