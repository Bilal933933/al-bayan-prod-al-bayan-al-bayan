<?php

use App\Http\Controllers\Admin\CompetitionController;
use App\Http\Controllers\Admin\TopicController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('competitions', CompetitionController::class);
        Route::resource('topics', TopicController::class)->except(['show']);

        // إدارة محاور المسابقة
        Route::get('competitions/{competition}/topics', [CompetitionController::class, 'editTopics'])
            ->name('competitions.topics.edit');
        Route::put('competitions/{competition}/topics', [CompetitionController::class, 'syncTopics'])
            ->name('competitions.topics.sync');
    });
