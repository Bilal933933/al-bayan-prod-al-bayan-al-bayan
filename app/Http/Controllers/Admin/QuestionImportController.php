<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\QuestionImportValidationException;
use App\Http\Controllers\Controller;
use App\Services\QuestionImportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:20480'],
        ]);

        try {
            $result = $this->importService->process($validated['file']->path());

            return redirect()
                ->route('admin.questions.index')
                ->with('success', "تم استيراد {$result['total']} سؤال بنجاح.");
        } catch (QuestionImportValidationException $e) {
            return back()->withErrors(['import' => $e->errors]);
        }
    }
}
