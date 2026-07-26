<?php

use App\Http\Controllers\Student\AttemptController;
use App\Http\Controllers\Student\CompetitionController;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\JoinCompetitionController;
use App\Http\Controllers\Student\LeaderboardController;
use App\Http\Controllers\Student\OnboardingController;
use App\Http\Controllers\Student\ProfileController;
use App\Http\Controllers\Student\ReportController;
use App\Http\Controllers\Student\ResultController;
use App\Http\Controllers\Student\SearchController;
use App\Http\Controllers\Student\TopicController;
use App\Models\Topic;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('student.dashboard');
    Route::get('search', SearchController::class)->name('student.search');

    // Student leaderboard route
    Route::get('leaderboard', [LeaderboardController::class, 'index'])->name('student.leaderboard');

    // Student report route
    Route::get('report', [ReportController::class, 'index'])->name('student.report');
    Route::post('report', [ReportController::class, 'store'])->name('student.report.store');

    // Student onboarding route
    Route::get('onboarding', [OnboardingController::class, 'index'])->name('student.onboarding');
    Route::post('onboarding', [OnboardingController::class, 'store'])->name('student.onboarding.store');

    // Student profile route
    Route::get('profile', [ProfileController::class, 'index'])->name('student.profile');

    // Student competition routes (POST actions only — GET routes are public in web.php)
    Route::prefix('competitions')->name('student.competitions.')->group(function () {
        Route::get('/{competition}/join', [JoinCompetitionController::class, 'index'])->name('join')->missing(fn () => Inertia::render('ErrorPage', [
            'status' => 404,
            'title' => 'المسابقة غير موجودة',
            'description' => 'عذراً، المسابقة التي تبحث عنها غير متوفرة أو قد تم حذفها',
            'actionLabel' => 'تصفح المسابقات',
            'actionHref' => route('student.competitions.index'),
        ]));
        Route::post('/{competition}/join', [JoinCompetitionController::class, 'store'])->name('join.store')->missing(fn () => Inertia::render('ErrorPage', [
            'status' => 404,
            'title' => 'المسابقة غير موجودة',
            'description' => 'عذراً، المسابقة التي تبحث عنها غير متوفرة أو قد تم حذفها',
            'actionLabel' => 'تصفح المسابقات',
            'actionHref' => route('student.competitions.index'),
        ]));
        Route::post('/{competition}/attempts', [AttemptController::class, 'startExam'])->name('attempts.start')->missing(fn () => Inertia::render('ErrorPage', [
            'status' => 404,
            'title' => 'المسابقة غير موجودة',
            'description' => 'عذراً، المسابقة التي تبحث عنها غير متوفرة أو قد تم حذفها',
            'actionLabel' => 'تصفح المسابقات',
            'actionHref' => route('student.competitions.index'),
        ]));
    });

    // Student topic routes (POST actions only — GET routes are public in web.php)
    Route::prefix('topics')->name('student.topics.')->group(function () {
        Route::post('/{topic}/attempts', [AttemptController::class, 'startPractice'])->name('attempts.start')->missing(fn () => Inertia::render('ErrorPage', [
            'status' => 404,
            'title' => 'المحور غير موجود',
            'description' => 'عذراً، المحور التدريبي الذي تبحث عنه غير متوفر',
            'actionLabel' => 'التدريب الحر',
            'actionHref' => route('student.topics.index'),
        ]));
        Route::get('/{topic}/attempts', fn (Topic $topic) => redirect()->route('student.topics.show', $topic))->name('attempts.redirect');
    });

    // Student results route
    Route::get('/results', [ResultController::class, 'index'])->name('student.results.index');

    // Student attempt routes
    Route::prefix('attempts')->name('student.attempts.')->group(function () {
        Route::get('/', [AttemptController::class, 'index'])->name('index');
        Route::get('/create', [AttemptController::class, 'create'])->name('create');
        Route::get('/{attempt}', [AttemptController::class, 'show'])->name('show')->missing(fn () => Inertia::render('ErrorPage', [
            'status' => 404,
            'title' => 'المحاولة غير موجودة',
            'description' => 'عذراً، المحاولة التي تبحث عنها غير متوفرة',
            'actionLabel' => 'محاولاتي',
            'actionHref' => route('student.attempts.index'),
        ]));
        Route::get('{attempt}/sections/{section}', [AttemptController::class, 'section'])->name('sections.show')->scopeBindings();
        Route::post('{attempt}/sections/{section}/submit', [AttemptController::class, 'submitSection'])->name('sections.submit')->scopeBindings();
        Route::patch('{attempt}/questions/{attemptQuestion}', [AttemptController::class, 'answerQuestion'])->name('questions.update');
        Route::post('{attempt}/finish', [AttemptController::class, 'finish'])->name('finish');
    });

});
