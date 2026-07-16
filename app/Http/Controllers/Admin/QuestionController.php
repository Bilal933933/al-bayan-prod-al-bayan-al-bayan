<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreQuestionRequest;
use App\Http\Requests\Admin\UpdateQuestionRequest;
use App\Models\Question;
use App\Models\Topic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class QuestionController extends Controller
{
    public function index(Request $request): Response
    {
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');
        $search = $request->query('search', '');
        $filter = $request->query('filter', 'all');

        $allowedSorts = ['text', 'type', 'difficulty', 'created_at'];
        $sort = in_array($sort, $allowedSorts) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';

        $query = Question::query()->with('topic:id,name')->withCount('options');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('text', 'like', "%{$search}%");
            });
        }

        if ($filter !== 'all') {
            $query->where('type', $filter);
        }

        if ($request->filled('topic_id')) {
            $query->where('topic_id', $request->integer('topic_id'));
        }

        if ($request->filled('difficulty')) {
            $query->where('difficulty', $request->string('difficulty'));
        }

        $questions = $query
            ->orderBy($sort, $direction)
            ->paginate(20)
            ->withQueryString();

        $topics = Topic::active()->get(['id', 'name']);

        return inertia('admin/questions/index', [
            'questions' => $questions,
            'topics' => $topics,
            'sort' => $sort,
            'direction' => $direction,
            'search' => $search,
            'filter' => $filter,
            'filters' => $request->only(['topic_id', 'difficulty']),
        ]);
    }

    public function create(): Response
    {
        $topics = Topic::active()->get(['id', 'name']);

        return inertia('admin/questions/create', [
            'topics' => $topics,
        ]);
    }

    public function show(Question $question): Response
    {
        $question->load('options', 'topic:id,name');
        $question->loadCount('options');

        return inertia('admin/questions/show', [
            'question' => $question,
        ]);
    }

    public function store(StoreQuestionRequest $request): RedirectResponse
    {
        $options = $request->validated('options', []);
        DB::transaction(function () use ($request, $options) {
            $question = Question::create($request->safe()->except('options'));

            $question->options()->createMany(
                collect((array) $options)->map(fn ($opt, $i) => [
                    ...$opt,
                    'order' => $i,
                ])
            );
        });

        return redirect()
            ->route('admin.questions.index')
            ->with('success', 'تم إنشاء السؤال بنجاح.');
    }

    public function edit(Question $question): Response
    {
        $question->load('options');

        $topics = Topic::active()->get(['id', 'name']);

        return inertia('admin/questions/edit', [
            'question' => $question,
            'topics' => $topics,
        ]);
    }

    public function update(UpdateQuestionRequest $request, Question $question): RedirectResponse
    {
        $options = $request->validated('options', []);
        DB::transaction(function () use ($request, $question, $options) {
            $question->update($request->safe()->except('options'));

            $question->options()->delete();

            $question->options()->createMany(
                collect((array) $options)->map(fn ($opt, $i) => [
                    ...$opt,
                    'order' => $i,
                ])
            );
        });

        return redirect()
            ->route('admin.questions.index')
            ->with('success', 'تم تحديث السؤال بنجاح.');
    }

    public function destroy(Question $question): RedirectResponse
    {
        $question->delete();

        return redirect()
            ->route('admin.questions.index')
            ->with('success', 'تم حذف السؤال بنجاح.');
    }
}
