<?php

use App\Http\Controllers\Student\CompetitionController;
use Illuminate\Support\Facades\Route;

// Student competition routes
Route::prefix('competitions')->name('student.competitions.')->group(function () {
    Route::get('/', [CompetitionController::class, 'index'])->name('index');
    Route::get('/{competition}', [CompetitionController::class, 'show'])->name('show');
});
