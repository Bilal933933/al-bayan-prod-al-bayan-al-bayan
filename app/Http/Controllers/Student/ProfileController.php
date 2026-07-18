<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(): Response
    {
        return inertia('student/profile');
    }
}
