<?php

use App\Http\Controllers\Student\CompetitionController;
use App\Http\Controllers\Student\TopicController;
use Illuminate\Support\Facades\Route;

// Student competition routes
Route::prefix('competitions')->name('student.competitions.')->group(function () {
    Route::get('/', [CompetitionController::class, 'index'])->name('index');
    Route::get('/{competition}', [CompetitionController::class, 'show'])->name('show');
});

// Student topic routes (free training hub)
Route::prefix('topics')->name('student.topics.')->group(function () {
    Route::get('/', [TopicController::class, 'index'])->name('index');
    Route::get('/{topic}', [TopicController::class, 'show'])->name('show');
});
