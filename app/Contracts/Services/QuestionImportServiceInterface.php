<?php

namespace App\Contracts\Services;

use Illuminate\Support\Collection;

interface QuestionImportServiceInterface
{
    public function read(string $filePath): Collection;

    public function validate(array $rows): array;

    public function process(string $filePath): array;
}
