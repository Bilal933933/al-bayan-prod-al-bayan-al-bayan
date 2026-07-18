<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Competition;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class JoinCompetitionController extends Controller
{
    public function index(Competition $competition): Response
    {
        $targetContainerId = $competition->parent_id ?? $competition->id;

        $isJoined = auth()->user()->competitions()
            ->where('competition_id', $targetContainerId)
            ->exists();

        if ($isJoined && ! $competition->isContainer()) {
            return redirect()->route('student.competitions.show', $competition);
        }

        $competition->loadCount(['topics', 'users']);
        $competition->load('children:id,parent_id,name,slug,icon,color,description');

        $totalQuestions = $competition->topics()->sum('competition_topic.questions_count');

        return inertia('student/competitions/join', [
            'competition' => $competition,
            'is_joined' => $isJoined,
            'total_questions' => (int) $totalQuestions,
        ]);
    }

    public function store(Competition $competition): RedirectResponse
    {
        abort_if($competition->isContainer(), 403, 'لا يمكن الانضمام مباشرة إلى حاوية.');

        $targetContainerId = $competition->parent_id ?? $competition->id;

        auth()->user()->competitions()->syncWithoutDetaching([
            $targetContainerId => ['joined_at' => now()],
        ]);

        return redirect()->route('student.competitions.show', $competition)
            ->with('success', 'تم الانضمام بنجاح، يمكنك البدء الآن.');
    }
}
