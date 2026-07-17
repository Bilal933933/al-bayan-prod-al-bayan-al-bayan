<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Competition;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $q = $request->query('q', '');

        if (mb_strlen($q) < 2) {
            return response()->json(['topics' => [], 'competitions' => []]);
        }

        $like = '%'.str_replace('%', '\\%', $q).'%';

        $topics = Topic::active()
            ->where(function ($query) use ($like) {
                $query->where('name', 'LIKE', $like)
                    ->orWhere('code', 'LIKE', $like);
            })
            ->get(['id', 'code', 'name']);

        $competitions = Competition::active()
            ->where(function ($query) use ($like) {
                $query->where('name', 'LIKE', $like)
                    ->orWhere('code', 'LIKE', $like);
            })
            ->get(['id', 'code', 'name', 'slug']);

        return response()->json([
            'topics' => $topics,
            'competitions' => $competitions,
        ]);
    }
}
