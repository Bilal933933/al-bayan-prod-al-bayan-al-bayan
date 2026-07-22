<?php

namespace App\Exceptions;

use Exception;

class QuestionImportValidationException extends Exception
{
    public function __construct(
        public readonly array $errors,
    ) {
        parent::__construct('فشل التحقق من صحة ملف الاستيراد');
    }
}
