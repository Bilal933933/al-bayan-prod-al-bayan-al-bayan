<?php

namespace App\Http\Resources;

use App\Models\QuestionOption;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin QuestionOption */
class QuestionOptionsResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'text' => $this->text,
            'order' => $this->order,
            'question_id' => $this->question_id,
        ];
    }
}
