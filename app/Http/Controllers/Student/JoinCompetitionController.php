<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Competition;
use Inertia\Response;

class JoinCompetitionController extends Controller
{
    public function index(Competition $competition): Response
    {
        return inertia('student/competitions/join', [
            'competition' => $competition->loadCount('topics'),
        ]);
    }
}
