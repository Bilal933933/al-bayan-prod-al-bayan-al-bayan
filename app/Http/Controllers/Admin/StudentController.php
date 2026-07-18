<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStudentRequest;
use App\Http\Requests\Admin\UpdateStudentRequest;
use App\Models\Attempt;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');
        $search = $request->query('search', '');
        $verifiedFilter = $request->query('verified', 'all');

        $allowedSorts = ['name', 'email', 'created_at', 'streak_days'];
        $sort = in_array($sort, $allowedSorts) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';

        $query = User::students();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($verifiedFilter === 'verified') {
            $query->whereNotNull('email_verified_at');
        } elseif ($verifiedFilter === 'unverified') {
            $query->whereNull('email_verified_at');
        }

        $stats = (clone $query)->toBase()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN email_verified_at IS NOT NULL THEN 1 ELSE 0 END) as verified')
            ->selectRaw("SUM(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) as new_this_week")
            ->first();

        $students = $query
            ->withCount(['attempts', 'competitions'])
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString();

        return inertia('admin/students/index', [
            'students' => $students,
            'sort' => $sort,
            'direction' => $direction,
            'search' => $search,
            'verifiedFilter' => $verifiedFilter,
            'stats' => [
                'total' => (int) ($stats->total ?? 0),
                'verified' => (int) ($stats->verified ?? 0),
                'new_this_week' => (int) ($stats->new_this_week ?? 0),
            ],
        ]);
    }

    public function create(): Response
    {
        return inertia('admin/students/create');
    }

    public function store(StoreStudentRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);

        if (isset($validated['email_verified_at'])) {
            $validated['email_verified_at'] = now();
        }

        User::create($validated);

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'تم إنشاء الطالب بنجاح.');
    }

    public function show(User $student): Response
    {
        abort_if($student->role !== User::ROLE_STUDENT, 404);

        $student->loadCount(['attempts', 'competitions']);

        $attempts = $student->attempts()
            ->with('competition')
            ->latest()
            ->take(10)
            ->get();

        $joinedCompetitions = $student->competitions()
            ->withPivot('joined_at')
            ->orderBy('competition_user.joined_at', 'desc')
            ->take(10)
            ->get();

        $stats = [
            'total_attempts' => $student->attempts_count,
            'joined_competitions' => $student->competitions_count,
            'streak_days' => $student->streak_days ?? 0,
            'last_activity' => $student->last_activity_at,
        ];

        $completedAttempts = $student->attempts()->where('status', Attempt::STATUS_COMPLETED);
        $stats['avg_score'] = $completedAttempts->count() > 0
            ? round($completedAttempts->avg('correct_answers') / $completedAttempts->avg('total_questions') * 100)
            : null;

        return inertia('admin/students/show', [
            'student' => $student,
            'attempts' => $attempts,
            'joinedCompetitions' => $joinedCompetitions,
            'stats' => $stats,
        ]);
    }

    public function edit(User $student): Response
    {
        abort_if($student->role !== User::ROLE_STUDENT, 404);

        return inertia('admin/students/edit', [
            'student' => $student,
        ]);
    }

    public function update(UpdateStudentRequest $request, User $student): RedirectResponse
    {
        abort_if($student->role !== User::ROLE_STUDENT, 404);

        $validated = $request->validated();

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        if ($request->has('email_verified_at')) {
            $validated['email_verified_at'] = now();
        } else {
            $validated['email_verified_at'] = null;
        }

        $student->update($validated);

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'تم تحديث بيانات الطالب بنجاح.');
    }

    public function destroy(User $student): RedirectResponse
    {
        abort_if($student->role !== User::ROLE_STUDENT, 404);

        $student->delete();

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'تم حذف الطالب بنجاح.');
    }
}
