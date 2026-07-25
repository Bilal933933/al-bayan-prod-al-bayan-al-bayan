<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\QuestionImportValidationException;
use App\Http\Controllers\Controller;
use App\Services\QuestionImportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class QuestionImportController extends Controller
{
    public function __construct(
        private readonly QuestionImportService $importService,
    ) {
        //
    }

    public function index(): Response
    {
        return inertia('admin/questions/import');
    }

    public function store(Request $request): RedirectResponse
    {
        $rateLimitKey = 'import:'.$request->user()->id;

        $executed = RateLimiter::attempt($rateLimitKey, 3, fn () => null, 600);

        if (! $executed) {
            return back()->withErrors(['file' => ['لقد تجاوزت الحد المسموح من محاولات الرفع. حاول مرة أخرى بعد 10 دقائق.']]);
        }

        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:20480'],
        ]);

        /** @var UploadedFile $file */
        $file = $validated['file'];
        $ext = $file->getClientOriginalExtension();
        $stored = $file->storeAs('imports', 'questions_'.time().'.'.$ext);

        if ($stored === false) {
            return back()->withErrors(['file' => ['فشل تخزين الملف. حاول مرة أخرى.']]);
        }

        try {
            $result = $this->importService->process(Storage::disk('local')->path($stored));

            RateLimiter::clear($rateLimitKey);

            return redirect()
                ->route('admin.questions.index')
                ->with('success', "تم استيراد {$result['total']} سؤال بنجاح.");
        } catch (QuestionImportValidationException $e) {
            return back()->withErrors(['import' => $e->errors]);
        } catch (\Throwable $e) {
            return back()->withErrors(['import' => ['حدث خطأ غير متوقع أثناء معالجة الملف: '.$e->getMessage()]]);
        } finally {
            Storage::disk('local')->delete($stored);
        }
    }
}
