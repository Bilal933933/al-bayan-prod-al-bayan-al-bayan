<?php

use App\Http\Controllers\Admin\CompetitionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('competitions', CompetitionController::class);
    });
