<?php

namespace App\Services;

use App\Exceptions\QuestionImportValidationException;
use App\Imports\QuestionsFileReader;
use App\Jobs\ImportQuestionsJob;
use App\Models\Topic;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Facades\Excel;

class QuestionImportService
{
    /** @var string[] */
    private const VALID_TYPES = ['mcq', 'true_false'];

    /** @var string[] */
    private const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

    /** @var array<string, int>|null */
    private ?array $topicCodeMap = null;

    /**
     * قراءة ملف Excel/CSV وإرجاع البيانات الخام.
     *
     * @return Collection<int, array{topic_code: string, type: string, text: string, difficulty: string, explanation: string|null, options: string[], correct_order: int}>
     */
    public function read(string $filePath): Collection
    {
        $rows = Excel::toArray(new QuestionsFileReader, $filePath);

        $data = collect();

        $allRows = $rows[0] ?? [];

        // تخطي صف الرأس (أول صف)
        for ($index = 1; $index < count($allRows); $index++) {
            $values = array_values($allRows[$index]);
            $rowNumber = $index + 1;

            // الخيارات: من العمود 5 إلى ما قبل الأخير
            $options = [];
            for ($i = 5; $i < count($values) - 1; $i++) {
                if (isset($values[$i]) && trim((string) $values[$i]) !== '') {
                    $options[] = trim((string) $values[$i]);
                }
            }

            $data->push([
                'row' => $rowNumber,
                'topic_code' => trim((string) ($values[0] ?? '')),
                'type' => trim((string) ($values[1] ?? 'mcq')),
                'text' => trim((string) ($values[2] ?? '')),
                'difficulty' => trim((string) ($values[3] ?? 'medium')),
                'explanation' => isset($values[4]) ? trim((string) $values[4]) ?: null : null,
                'options' => $options,
                'correct_order' => isset($values[count($values) - 1]) ? (int) $values[count($values) - 1] : 0,
            ]);
        }

        return $data;
    }

    /**
     * التحقق من صحة جميع الصفوف.
     *
     * @param  Collection<int, array>  $rows
     * @return Collection<int, array{topic_id: int, type: string, text: string, difficulty: string, explanation: string|null, options: array{text: string, is_correct: bool, order: int}[]}>
     *
     * @throws QuestionImportValidationException
     */
    public function validate(Collection $rows): Collection
    {
        $errors = [];
        $seenTexts = [];
        $this->topicCodeMap = Topic::pluck('id', 'code')->toArray();

        $validated = $rows->map(function (array $row) use (&$errors, &$seenTexts) {
            $rowNum = $row['row'];

            // topic_code
            if (empty($row['topic_code'])) {
                $errors[] = "الصف {$rowNum}: كود الموضوع مطلوب";
            } elseif (!isset($this->topicCodeMap[$row['topic_code']])) {
                $errors[] = "الصف {$rowNum}: كود الموضوع '{$row['topic_code']}' غير موجود";
            }

            // type
            if (!in_array($row['type'], self::VALID_TYPES, true)) {
                $errors[] = "الصف {$rowNum}: نوع السؤال غير صالح '{$row['type']}' (القيم المسموحة: mcq, true_false)";
            }

            // text
            if (empty($row['text'])) {
                $errors[] = "الصف {$rowNum}: نص السؤال مطلوب";
            } elseif (isset($seenTexts[$row['text']])) {
                $errors[] = "الصف {$rowNum}: نص السؤال مكرر (موجود أيضاً في الصف {$seenTexts[$row['text']]})";
            } else {
                $seenTexts[$row['text']] = $rowNum;
            }

            // difficulty
            if (!in_array($row['difficulty'], self::VALID_DIFFICULTIES, true)) {
                $errors[] = "الصف {$rowNum}: مستوى الصعوبة غير صالح '{$row['difficulty']}' (القيم المسموحة: easy, medium, hard)";
            }

            // options
            if ($row['type'] === 'true_false') {
                if (count($row['options']) < 2) {
                    $errors[] = "الصف {$rowNum}: أسئلة صح/خطأ تتطلب خيارين على الأقل";
                }
            } elseif (count($row['options']) < 2) {
                $errors[] = "الصف {$rowNum}: يجب أن يحتوي السؤال على خيارين على الأقل";
            }

            // correct_order
            $maxOrder = count($row['options']);
            if ($row['correct_order'] < 1 || $row['correct_order'] > $maxOrder) {
                $errors[] = "الصف {$rowNum}: رقم الإجابة الصحيحة غير صالح (يجب أن يكون بين 1 و {$maxOrder})";
            }

            return $row;
        });

        if (!empty($errors)) {
            throw new QuestionImportValidationException($errors);
        }

        return $validated->map(function (array $row) {
            $options = [];
            foreach ($row['options'] as $i => $optText) {
                $options[] = [
                    'text' => $optText,
                    'is_correct' => ($i + 1) === $row['correct_order'],
                    'order' => $i + 1,
                ];
            }

            return [
                'topic_id' => $this->topicCodeMap[$row['topic_code']],
                'type' => $row['type'],
                'text' => $row['text'],
                'difficulty' => $row['difficulty'],
                'explanation' => $row['explanation'],
                'is_active' => true,
                'options' => $options,
            ];
        });
    }

    /**
     * معالجة الاستيراد: تحقق + إرسال Job.
     *
     * @return array{total: int, errors: string[]}
     */
    public function process(string $filePath): array
    {
        $rows = $this->read($filePath);
        $validated = $this->validate($rows);

        ImportQuestionsJob::dispatch($validated->toArray());

        return [
            'total' => $validated->count(),
            'errors' => [],
        ];
    }
}
