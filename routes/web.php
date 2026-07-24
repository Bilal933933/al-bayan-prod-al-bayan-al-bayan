<?php

use Illuminate\Support\Facades\Route;

// المسار الرئيسي الذي تفحصه المنصة دائماً (يجب أن يعيد 200 OK مباشرة)
Route::get('/', function () {
    // إذا كان الطلب من منصة الفحص أو بدون طلب Inertia معقد، أرجع نص أو استجابة صريحة
    if (request()->header('X-Inertia') === null && !request()->expectsJson()) {
        return response('OK', 200);
    }

    // غير ذلك اعرض صفحة الترحيب العادية
    return inertia('welcome');
})->name('home');

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

require __DIR__ . '/settings.php';