<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');
        $search = $request->query('search', '');
        $statusFilter = $request->query('status', 'all');

        $allowedSorts = ['id', 'type', 'status', 'created_at'];
        $sort = in_array($sort, $allowedSorts) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';

        $query = Report::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        $stats = (clone $query)->toBase()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending")
            ->selectRaw("SUM(CASE WHEN status = 'reviewed' THEN 1 ELSE 0 END) as reviewed")
            ->selectRaw("SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved")
            ->selectRaw("SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected")
            ->first();

        $reports = $query
            ->with('user:id,name,email')
            ->with('question:id,text')
            ->orderBy($sort, $direction)
            ->paginate(20)
            ->withQueryString();

        return inertia('admin/reports/index', [
            'reports' => $reports,
            'sort' => $sort,
            'direction' => $direction,
            'search' => $search,
            'statusFilter' => $statusFilter,
            'stats' => [
                'total' => (int) ($stats->total ?? 0),
                'pending' => (int) ($stats->pending ?? 0),
                'reviewed' => (int) ($stats->reviewed ?? 0),
                'resolved' => (int) ($stats->resolved ?? 0),
                'rejected' => (int) ($stats->rejected ?? 0),
            ],
        ]);
    }

    public function show(Report $report): Response
    {
        $report->load(['user', 'question']);

        return inertia('admin/reports/show', [
            'report' => $report,
        ]);
    }

    public function update(Request $request, Report $report): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,reviewed,resolved,rejected'],
            'admin_response' => ['nullable', 'string', 'max:2000'],
        ]);

        $data = ['status' => $validated['status']];

        if ($request->filled('admin_response')) {
            $data['admin_response'] = $validated['admin_response'];
            $data['admin_response_at'] = now();
            $data['admin_read_at'] = null;
        }

        $report->update($data);

        return back()->with('success', 'تم تحديث البلاغ بنجاح.');
    }
}
