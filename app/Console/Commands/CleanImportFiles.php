<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

#[Signature('app:clean-import-files')]
#[Description('Delete imported question files older than 24 hours')]
class CleanImportFiles extends Command
{
    public function handle(): void
    {
        $files = Storage::disk('local')->files('imports');
        $cutoff = now()->subDay();
        $deleted = 0;

        foreach ($files as $file) {
            $lastModified = Storage::disk('local')->lastModified($file);
            if ($lastModified < $cutoff->timestamp) {
                Storage::disk('local')->delete($file);
                $deleted++;
            }
        }

        $this->info("Cleaned {$deleted} old import file(s).");
    }
}
