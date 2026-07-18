<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        return inertia('student/report');
    }
}
