<?php

namespace App\Jobs;

use App\Contracts\Repositories\QuestionRepositoryInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class ImportQuestionsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @param  array<int, array{topic_id: int, type: string, text: string, difficulty: string, explanation: string|null, is_active: bool, options: array{text: string, is_correct: bool, order: int}[]}>  $questions
     */
    public function __construct(
        public readonly array $questions,
    ) {
        //
    }

    public function handle(QuestionRepositoryInterface $repository): void
    {
        DB::transaction(function () use ($repository) {
            foreach ($this->questions as $questionData) {
                $options = $questionData['options'];
                unset($questionData['options']);

                $question = $repository->createQuestion($questionData);

                $optionRecords = [];
                foreach ($options as $option) {
                    $optionRecords[] = [
                        'question_id' => $question->id,
                        'text' => $option['text'],
                        'is_correct' => $option['is_correct'],
                        'order' => $option['order'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                $repository->insertOptions($optionRecords);
            }
        });
    }
}
