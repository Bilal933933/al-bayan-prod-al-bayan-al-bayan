<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /**
     * Reflash session data — نقل الفلاش القياسي من Laravel إلى Inertia.
     */
    protected function reflash(Request $request): void
    {
        $this->transferFlash($request);

        parent::reflash($request);
    }

    /**
     * نقل رسائل الفلاش القياسية (success, error) من Laravel إلى Inertia flash.
     */
    protected function transferFlash(Request $request): void
    {
        if (! $request->hasSession()) {
            return;
        }

        $mapped = [];

        foreach (['success', 'error', 'warning', 'info'] as $key) {
            if ($request->session()->has($key)) {
                $mapped[$key] = $request->session()->get($key);
            }
        }

        if ($mapped) {
            Inertia::flash($mapped);
        }
    }
}
