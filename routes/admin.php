<?php

use App\Http\Controllers\Admin\AttemptController;
use App\Http\Controllers\Admin\CompetitionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\TopicController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::resource('competitions', CompetitionController::class);
        Route::resource('topics', TopicController::class);

        // إدارة محاور المسابقة
        Route::get('competitions/{competition}/topics', [CompetitionController::class, 'editTopics'])
            ->name('competitions.topics.edit');
        Route::put('competitions/{competition}/topics', [CompetitionController::class, 'syncTopics'])
            ->name('competitions.topics.sync');

        Route::resource('questions', QuestionController::class);
        Route::resource('attempts', AttemptController::class)->only(['index', 'show']);
    });
