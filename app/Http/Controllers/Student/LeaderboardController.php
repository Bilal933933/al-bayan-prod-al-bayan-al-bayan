<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Response;

class LeaderboardController extends Controller
{
    public function index(): Response
    {
        return inertia('student/leaderboard');
    }
}
