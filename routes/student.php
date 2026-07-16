<?php

use App\Http\Controllers\Student\AttemptController;
use App\Http\Controllers\Student\CompetitionController;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\ResultController;
use App\Http\Controllers\Student\TopicController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('student.dashboard');

    // Student competition routes
    Route::prefix('competitions')->name('student.competitions.')->group(function () {
        Route::get('/', [CompetitionController::class, 'index'])->name('index');
        Route::get('/{competition}', [CompetitionController::class, 'show'])->name('show');
        Route::post('/{competition}/attempts', [AttemptController::class, 'startExam'])->name('attempts.start');
    });

    // Student topic routes (free training hub)
    Route::prefix('topics')->name('student.topics.')->group(function () {
        Route::get('/', [TopicController::class, 'index'])->name('index');
        Route::get('/{topic}', [TopicController::class, 'show'])->name('show');
        Route::post('/{topic}/attempts', [AttemptController::class, 'startPractice'])->name('attempts.start');
    });

    // Student results route
    Route::get('/results', [ResultController::class, 'index'])->name('student.results.index');

    // Student attempt routes
    Route::prefix('attempts')->name('student.attempts.')->group(function () {
        Route::get('/', [AttemptController::class, 'index'])->name('index');
        Route::get('/{attempt}', [AttemptController::class, 'show'])->name('show');
        Route::get('{attempt}/sections/{section}', [AttemptController::class, 'section'])->name('sections.show');
        Route::post('{attempt}/sections/{section}/submit', [AttemptController::class, 'submitSection'])->name('sections.submit');
        Route::patch('{attempt}/questions/{attemptQuestion}', [AttemptController::class, 'answerQuestion'])->name('questions.update');
        Route::post('{attempt}/finish', [AttemptController::class, 'finish'])->name('finish');
    });

});
