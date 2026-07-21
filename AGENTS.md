# AGENTS.md — Exam Platform

## Identity

Arabic exam platform (RTL). Laravel 13 + Inertia v3 React + Tailwind v4 + PostgreSQL. Served by Herd.

## Key directories

| Path | Role |
|------|------|
| `app/Models/` | ~10 Eloquent models: Attempt, AttemptSection, AttemptQuestion, Question, QuestionOption, Topic, Competition, CompetitionTopic, UserScore, User |
| `app/Services/` | Business logic: AttemptCreationService, ExamGeneratorService, ExamGradingService |
| `app/Http/Controllers/Student/` | Student routes (auth+verified) |
| `app/Http/Controllers/Admin/` | Admin routes (auth+verified+admin middleware) |
| `routes/student.php` | All student-facing routes |
| `routes/admin.php` | All admin routes |
| `resources/js/pages/student/` | Inertia pages: attempts, topics, competitions, results |
| `resources/js/pages/admin/` | Admin Inertia pages |
| `resources/js/components/student/attempts/` | ~11 components for test-taking UI |
| `resources/js/types/` | TypeScript interfaces for all models |
| `resources/js/routes/` | Wayfinder-generated typed route functions |
| `tests/Feature/Student/` | Feature tests (94 attempt tests) |

## Commands

- **Start dev**: `composer run dev` (serves Laravel + queue + Vite concurrently)
- **Build frontend**: `npm run build`
- **Run all tests**: `php artisan test --compact`
- **Run single test**: `php artisan test --compact --filter=testName`
- **PHP lint**: `vendor/bin/pint --format agent` (auto-fix dirty files)
- **PHP typecheck**: `phpstan analyse`
- **JS lint**: `npm run lint` / `npm run lint:check`
- **JS typecheck**: `npm run types:check` (tsc)
- **JS format**: `npm run format` / `npm run format:check`
- **Full CI**: `composer run ci:check` (lint → typecheck → test)
- **Clear cache**: `php artisan view:clear` (needed after route changes)

## Testing

- Pest 4 with `RefreshDatabase` trait (`tests/Pest.php`)
- `php artisan make:test --pest SomeFeatureTest` (omit `Feature/` prefix)
- Tests use `fake()->word()` / `$this->faker->word()` — follow existing patterns
- Database state: tests truncate all tables, seed via factories

## Architecture

- **Two attempt types**: `practice` (single topic, flexible config) and `exam` (competition-based, multi-section)
- **Attempt flow**: `create` (page) → `startPractice`/`startExam` (POST) → `show` (renders `take.tsx` or `show.tsx`) → `section` (fetch Qs) → `answerQuestion` (PATCH) → `submitSection`/`finish` (POST)
- **Timer**: `duration_minutes` on `attempt_sections`, enforced server-side via `handleExpiredSections()`, UI counts elapsed from `section.started_at`
- **Scoring**: `UserScore` created on completion (correct_count as points)
- **Inertia layout resolution** (`app.tsx`): `student/*` → `StudentLayout`, `admin/*` → `AdminLayout`, `auth/*` → `AuthLayout`, `settings/*` → `AdminLayout + SettingsLayout`
- **ExamWorkspaceLayout** (`exam-workspace-layout.tsx`): minimal layout (just flex column) used by `take.tsx`

## Database schema (core)

- `attempts` — user_id, type (practice|exam), status, with_timer, started_at, finished_at, total_questions, answered_count, correct_answers, score_percentage
- `attempt_sections` — attempt_id, topic_id, questions_count, duration_minutes, order, started_at, submitted_at
- `attempt_questions` — section_id, question_id, selected_option_id, is_correct, order
- `questions` — topic_id, type, text, difficulty (easy|medium|hard), explanation, is_active
- `question_options` — question_id, text, is_correct, order
- `competitions` — hierarchical (parent_id), classification, start_date, end_date
- `competition_topic` — pivot with questions_count, duration_minutes, difficulty_distribution (json)
- `topics` — code, visibility, default_questions_count, default_duration_minutes, is_active
- `user_scores` — user_id, attempt_id, points, type

## Frontend quirks

- **React Compiler** is enabled (`babel-plugin-react-compiler` in vite config) — may affect hook rules
- **Wayfinder** generates `@/routes/student/attempts` etc.; use `route.url` for URLs and `route.method` for HTTP method
- **Sonner** `Toaster` lives in `app.tsx` (wrapped in `TooltipProvider`)
- **DateDisplay** with `format="relative"` causes hydration mismatch (server vs client `Date.now()`) — fix: use `useEffect` or `suppressHydrationWarning`
- **page state persistence**: `useRemember` from Inertia uses `history.replaceState`, lost on F5. Use `localStorage` for state that must survive full page reloads (like current section/question index in the test-taking page)
- `shadcn/ui` components use Radix primitives (`@radix-ui/*`)
- Tailwind v4 via `@tailwindcss/vite` plugin

## Known gotchas

- `DB::transaction()` closures require all used variables in the `use` clause — forgetting `$withTimer` caused 500 errors
- `StartPracticeRequest` must accept nullable `with_timer` (client may send empty body `{}`); default to `true` in controller with `?? true`
- `AttemptSection::isExpired()` uses `$this->started_at` (no parameter) — when refactored, ensure all callers match
- Inertia `onError` only catches validation errors (422), NOT 500 errors; `onError` must be passed explicitly (not handled by `onFinish`)
- Route name for starting practice: `student.topics.attempts.start` (POST `/topics/{topic}/attempts`)
- Route name for starting exam: `student.competitions.attempts.start` (POST `/competitions/{competition}/attempts`)
- Admin middleware is `admin` (custom guard, not role check on user model)
- Font: Cairo (Arabic) + Instrument Sans (Latin), loaded via `bunny()` in vite config

## Skills (`.agents/skills/`)

Activate matching skill for domain-specific guidance:
- `fortify-development` — auth, 2FA, passkeys
- `inertia-react-development` — Inertia React client patterns
- `laravel-best-practices` — Laravel PHP code
- `pest-testing` — Pest tests
- `tailwindcss-development` — Tailwind utility classes
- `wayfinder-development` — typed route generation
