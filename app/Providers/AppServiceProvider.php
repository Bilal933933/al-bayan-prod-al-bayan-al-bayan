<?php

namespace App\Providers;

use App\Contracts\Repositories\QuestionRepositoryInterface;
use App\Contracts\Services\AttemptCreationServiceInterface;
use App\Contracts\Services\ExamGradingServiceInterface;
use App\Contracts\Services\LeaderboardServiceInterface;
use App\Contracts\Services\PlatformInsightsServiceInterface;
use App\Contracts\Services\QuestionImportServiceInterface;
use App\Models\Attempt;
use App\Policies\AttemptPolicy;
use App\Repositories\QuestionRepository;
use App\Services\AttemptCreationService;
use App\Services\ExamGradingService;
use App\Services\LeaderboardService;
use App\Services\PlatformInsightsService;
use App\Services\QuestionImportService;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\ExceptionResponse;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ExamGradingServiceInterface::class, ExamGradingService::class);
        $this->app->bind(AttemptCreationServiceInterface::class, AttemptCreationService::class);
        $this->app->bind(LeaderboardServiceInterface::class, LeaderboardService::class);
        $this->app->bind(PlatformInsightsServiceInterface::class, PlatformInsightsService::class);
        $this->app->bind(QuestionRepositoryInterface::class, QuestionRepository::class);
        $this->app->bind(QuestionImportServiceInterface::class, QuestionImportService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        Gate::policy(Attempt::class, AttemptPolicy::class);

        Event::listen(Registered::class, SendEmailVerificationNotification::class);

        $this->configureDefaults();

        Inertia::handleExceptionsUsing(function (ExceptionResponse $response) {
            if (in_array($response->statusCode(), [403, 404, 500, 503])) {
                return $response->render('ErrorPage', [
                    'status' => $response->statusCode(),
                ])->withSharedData();
            }
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
