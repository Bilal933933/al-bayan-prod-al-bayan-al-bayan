<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('app:cache-leaderboard-snapshot')
    ->weekly()
    ->fridays()
    ->at('23:59');

Schedule::command('app:clean-import-files')
    ->daily()
    ->at('03:00');
