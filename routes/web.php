<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Guest\GuestPracticeController;
use App\Http\Controllers\Student\CompetitionController;
use App\Http\Controllers\Student\TopicController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// المسار الرئيسي الذي تفحصه المنصة دائماً (يجب أن يعيد 200 OK مباشرة)
Route::get('/', [WelcomeController::class, 'index'])->name('home');

// Guest practice demo (no auth required)
Route::get('try-demo', [GuestPracticeController::class, 'show'])->name('guest.practice');
Route::post('practice/{topic}/check', [GuestPracticeController::class, 'check'])->name('guest.practice.check');

// Public topics — browse without auth
Route::prefix('topics')->name('student.topics.')->group(function () {
    Route::get('/', [TopicController::class, 'index'])->name('index');
    Route::get('/{topic}', [TopicController::class, 'show'])->name('show')->missing(fn () => Inertia::render('ErrorPage', [
        'status' => 404,
        'title' => 'المحور غير موجود',
        'description' => 'عذراً، المحور التدريبي الذي تبحث عنه غير متوفر',
        'actionLabel' => 'التدريب الحر',
        'actionHref' => route('student.topics.index'),
    ]));
});

// Public competitions — browse without auth
Route::prefix('competitions')->name('student.competitions.')->group(function () {
    Route::get('/', [CompetitionController::class, 'index'])->name('index');
    Route::get('/{competition}', [CompetitionController::class, 'show'])->name('show')->missing(fn () => Inertia::render('ErrorPage', [
        'status' => 404,
        'title' => 'المسابقة غير موجودة',
        'description' => 'عذراً، المسابقة التي تبحث عنها غير متوفرة أو قد تم حذفها',
        'actionLabel' => 'تصفح المسابقات',
        'actionHref' => route('student.competitions.index'),
    ]));
});

Route::prefix('guide')->group(function () {
    Route::inertia('journey', 'guide/journey')->name('guide.journey');
    Route::inertia('exam-day', 'guide/exam-day')->name('guide.exam-day');
    Route::inertia('exam-format', 'guide/exam-format')->name('guide.exam-format');
    Route::inertia('getting-started', 'guide/getting-started')->name('guide.getting-started');
    Route::inertia('after-results', 'guide/after-results')->name('guide.after-results');
    Route::inertia('faq', 'guide/faq')->name('guide.faq');
    Route::inertia('resources', 'guide/resources')->name('guide.resources');
});
Route::inertia('faq', 'faq')->name('faq');
Route::inertia('resources', 'resources')->name('resources');

// Google OAuth
Route::middleware('guest')->group(function () {
    Route::get('auth/google/redirect', [GoogleController::class, 'redirect'])
        ->name('auth.google.redirect');

    Route::get('auth/google/callback', [GoogleController::class, 'callback'])
        ->name('auth.google.callback');
});

require __DIR__.'/settings.php';
