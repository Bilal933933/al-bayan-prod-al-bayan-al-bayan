<?php

namespace App\Services;

use App\Exceptions\QuestionImportValidationException;
use App\Imports\QuestionsFileReader;
use App\Jobs\ImportQuestionsJob;
use App\Models\Question;
use App\Models\Topic;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Bus;
use Maatwebsite\Excel\Facades\Excel;

class QuestionImportService
{
    /** @var string[] */
    private const VALID_TYPES = ['mcq', 'true_false'];

    /** @var string[] */
    private const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

    /**
     * قراءة ملف Excel/CSV وإرجاع البيانات الخام.
     *
     * @return Collection<int, array{row: int, topic_code: string, type: string, text: string, difficulty: string, explanation: string|null, options: string[], correct_order: int}>
     */
    public function read(string $filePath): Collection
    {
        $rows = Excel::toArray(new QuestionsFileReader, $filePath);

        $data = collect();

        $allRows = $rows[0] ?? [];

        foreach ($allRows as $index => $values) {
            if ($index === 0) {
                continue;
            }

            $values = array_values((array) $values);

            $lastNonEmpty = count($values) - 1;
            while ($lastNonEmpty >= 5 && (! isset($values[$lastNonEmpty]) || trim((string) $values[$lastNonEmpty]) === '')) {
                $lastNonEmpty--;
            }

            $options = [];
            for ($i = 5; $i < $lastNonEmpty; $i++) {
                if (isset($values[$i]) && trim((string) $values[$i]) !== '') {
                    $options[] = trim((string) $values[$i]);
                }
            }

            $data->push([
                'row' => $index + 1,
                'topic_code' => trim((string) ($values[0] ?? '')),
                'type' => trim((string) ($values[1] ?? 'mcq')),
                'text' => trim((string) ($values[2] ?? '')),
                'difficulty' => trim((string) ($values[3] ?? 'medium')),
                'explanation' => isset($values[4]) ? trim((string) $values[4]) ?: null : null,
                'options' => $options,
                'correct_order' => isset($values[$lastNonEmpty]) ? (int) $values[$lastNonEmpty] : 0,
            ]);
        }

        return $data;
    }

    /**
     * التحقق من صحة جميع الصفوف.
     *
     * @param  array<int, array{row: int, topic_code: string, type: string, text: string, difficulty: string, explanation: string|null, options: string[], correct_order: int}>  $rows
     * @return array<int, array{topic_id: int, type: string, text: string, difficulty: string, explanation: string|null, is_active: bool, options: list<array{text: string, is_correct: bool, order: int}>}>
     *
     * @throws QuestionImportValidationException
     */
    public function validate(array $rows): array
    {
        $errors = [];
        $seenTexts = [];
        $codeMap = [];
        foreach (Topic::select('id', 'code')->get() as $topic) {
            $codeMap[strtolower($topic->code)] = $topic->id;
        }

        $topicIds = array_values($codeMap);
        $existingTexts = [];
        if ($topicIds !== []) {
            $existing = Question::whereIn('topic_id', $topicIds)
                ->select('topic_id', 'text')
                ->get();
            foreach ($existing as $q) {
                $existingTexts[$q->topic_id][$q->text] = true;
            }
        }

        $validated = [];
        foreach ($rows as $row) {
            $rowNum = $row['row'];
            $topicCode = strtolower(trim($row['topic_code']));
            $topicId = isset($codeMap[$topicCode]) ? $codeMap[$topicCode] : null;

            if (empty($row['topic_code'])) {
                $errors[] = "الصف {$rowNum}: كود الموضوع مطلوب";
            } elseif ($topicId === null) {
                $errors[] = "الصف {$rowNum}: كود الموضوع '{$row['topic_code']}' غير موجود";
            }

            if (! in_array($row['type'], self::VALID_TYPES, true)) {
                $errors[] = "الصف {$rowNum}: نوع السؤال غير صالح '{$row['type']}' (القيم المسموحة: mcq, true_false)";
            }

            if (empty($row['text'])) {
                $errors[] = "الصف {$rowNum}: نص السؤال مطلوب";
            } elseif (isset($seenTexts[$row['text']])) {
                $errors[] = "الصف {$rowNum}: نص السؤال مكرر في نفس الملف (موجود أيضاً في الصف {$seenTexts[$row['text']]})";
            } else {
                $seenTexts[$row['text']] = $rowNum;
            }

            if ($topicId !== null && ! empty($row['text']) && isset($existingTexts[$topicId][$row['text']])) {
                $errors[] = "الصف {$rowNum}: السؤال '{$row['text']}' موجود مسبقاً في نفس الموضوع";
            }

            if (! in_array($row['difficulty'], self::VALID_DIFFICULTIES, true)) {
                $errors[] = "الصف {$rowNum}: مستوى الصعوبة غير صالح '{$row['difficulty']}' (القيم المسموحة: easy, medium, hard)";
            }

            if ($row['type'] === 'true_false') {
                if (count($row['options']) < 2) {
                    $errors[] = "الصف {$rowNum}: أسئلة صح/خطأ تتطلب خيارين على الأقل";
                }
            } elseif (count($row['options']) < 2) {
                $errors[] = "الصف {$rowNum}: يجب أن يحتوي السؤال على خيارين على الأقل";
            }

            $maxOrder = count($row['options']);
            if ($row['correct_order'] < 1 || $row['correct_order'] > $maxOrder) {
                $errors[] = "الصف {$rowNum}: رقم الإجابة الصحيحة غير صالح (يجب أن يكون بين 1 و {$maxOrder})";
            }

            $validated[] = $row;
        }

        if ($errors !== []) {
            throw new QuestionImportValidationException($errors);
        }

        $questions = [];
        foreach ($validated as $row) {
            $options = [];
            foreach ($row['options'] as $i => $optText) {
                $options[] = [
                    'text' => $optText,
                    'is_correct' => ($i + 1) === $row['correct_order'],
                    'order' => $i + 1,
                ];
            }

            $questions[] = [
                'topic_id' => $codeMap[strtolower($row['topic_code'])],
                'type' => $row['type'],
                'text' => $row['text'],
                'difficulty' => $row['difficulty'],
                'explanation' => $row['explanation'],
                'is_active' => true,
                'options' => $options,
            ];
        }

        return $questions;
    }

    /**
     * معالجة الاستيراد: تحقق + إرسال Job.
     *
     * @return array{total: int, errors: string[]}
     */
    public function process(string $filePath): array
    {
        $rows = $this->read($filePath);
        $validated = $this->validate($rows->all());

        Bus::dispatchSync(new ImportQuestionsJob($validated));

        return [
            'total' => count($validated),
            'errors' => [],
        ];
    }
}
