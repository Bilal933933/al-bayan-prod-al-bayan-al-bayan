<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function index(): Response
    {
        $topics = Topic::query()
            ->active()
            ->general()
            ->select(['id', 'name'])
            ->get();

        return inertia('student/onboarding', [
            'topics' => $topics,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'topic_ids' => ['required', 'array', 'min:1'],
            'topic_ids.*' => ['exists:topics,id'],
            'difficulty' => ['required', 'string', 'in:beginner,intermediate,advanced'],
            'notifications' => ['required', 'array'],
            'notifications.daily' => ['boolean'],
            'notifications.comp' => ['boolean'],
            'notifications.streak' => ['boolean'],
        ]);

        /** @var User */
        $user = auth()->user();

        $user->update([
            'preferences' => [
                'topic_ids' => $validated['topic_ids'],
                'difficulty' => $validated['difficulty'],
                'notifications' => $validated['notifications'],
            ],
            'onboarding_completed' => true,
        ]);

        return to_route('student.dashboard');
    }
}
