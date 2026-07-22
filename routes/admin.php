<?php

use App\Http\Controllers\Admin\AttemptController;
use App\Http\Controllers\Admin\CompetitionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\QuestionImportController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TopicController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::resource('competitions', CompetitionController::class)
            ->missing(fn () => Inertia::render('ErrorPage', [
                'status' => 404,
                'title' => 'المسابقة غير موجودة',
                'description' => 'عذراً، المسابقة التي تبحث عنها غير متوفرة',
                'actionLabel' => 'المسابقات',
                'actionHref' => route('admin.competitions.index'),
            ]));

        Route::resource('topics', TopicController::class)
            ->missing(fn () => Inertia::render('ErrorPage', [
                'status' => 404,
                'title' => 'المحور غير موجود',
                'description' => 'عذراً، المحور الذي تبحث عنه غير متوفر',
                'actionLabel' => 'المحاور',
                'actionHref' => route('admin.topics.index'),
            ]));

        // إدارة محاور المسابقة
        Route::get('competitions/{competition}/topics', [CompetitionController::class, 'editTopics'])
            ->name('competitions.topics.edit')
            ->missing(fn () => Inertia::render('ErrorPage', [
                'status' => 404,
                'title' => 'المسابقة غير موجودة',
                'description' => 'عذراً، المسابقة التي تبحث عنها غير متوفرة',
                'actionLabel' => 'المسابقات',
                'actionHref' => route('admin.competitions.index'),
            ]));
        Route::put('competitions/{competition}/topics', [CompetitionController::class, 'syncTopics'])
            ->name('competitions.topics.sync')
            ->missing(fn () => Inertia::render('ErrorPage', [
                'status' => 404,
                'title' => 'المسابقة غير موجودة',
                'description' => 'عذراً، المسابقة التي تبحث عنها غير متوفرة',
                'actionLabel' => 'المسابقات',
                'actionHref' => route('admin.competitions.index'),
            ]));

        Route::get('questions/import', [QuestionImportController::class, 'index'])
            ->name('questions.import-file');
        Route::post('questions/import', [QuestionImportController::class, 'store'])
            ->name('questions.import-file.store');

        Route::resource('questions', QuestionController::class)
            ->missing(fn () => Inertia::render('ErrorPage', [
                'status' => 404,
                'title' => 'السؤال غير موجود',
                'description' => 'عذراً، السؤال الذي تبحث عنه غير متوفر',
                'actionLabel' => 'الأسئلة',
                'actionHref' => route('admin.questions.index'),
            ]));

        Route::resource('attempts', AttemptController::class)->only(['index', 'show'])
            ->missing(fn () => Inertia::render('ErrorPage', [
                'status' => 404,
                'title' => 'المحاولة غير موجودة',
                'description' => 'عذراً، المحاولة التي تبحث عنها غير متوفرة',
                'actionLabel' => 'المحاولات',
                'actionHref' => route('admin.attempts.index'),
            ]));

        Route::resource('students', StudentController::class)
            ->parameters(['students' => 'student'])
            ->missing(fn () => Inertia::render('ErrorPage', [
                'status' => 404,
                'title' => 'الطالب غير موجود',
                'description' => 'عذراً، الطالب الذي تبحث عنه غير متوفر',
                'actionLabel' => 'الطلاب',
                'actionHref' => route('admin.students.index'),
            ]));

        Route::resource('reports', ReportController::class)->only(['index', 'show', 'update'])
            ->missing(fn () => Inertia::render('ErrorPage', [
                'status' => 404,
                'title' => 'البلاغ غير موجود',
                'description' => 'عذراً، البلاغ الذي تبحث عنه غير متوفر',
                'actionLabel' => 'البلاغات',
                'actionHref' => route('admin.reports.index'),
            ]));
    });
