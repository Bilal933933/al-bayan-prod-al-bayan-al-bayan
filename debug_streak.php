<?php

use App\Models\Attempt;
use App\Models\User;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$attempts = Attempt::where('status', 'completed')->get();
$userDates = [];

foreach ($attempts as $a) {
    if ($a->finished_at) {
        $date = $a->finished_at->copy()->startOfDay();
        $userDates[$a->user_id][] = $date;
    }
}

foreach ($userDates as $userId => $dates) {
    $dateStrs = collect($dates)->map(fn ($d) => $d->format('Y-m-d'))->unique()->sort()->values();
    echo "User $userId: ".json_encode($dateStrs->toArray())."\n";

    // Calculate streak
    $streakDays = 0;
    $lastDate = null;
    foreach ($dateStrs as $dateStr) {
        $current = Carbon\Carbon::parse($dateStr);
        if ($lastDate === null) {
            $streakDays = 1;
        } elseif ($current->diffInDays($lastDate) === 1) {
            $streakDays++;
        } elseif ($current->diffInDays($lastDate) > 1) {
            $streakDays = 1;
        }
        echo "  $dateStr -> lastDate=".($lastDate?->format('Y-m-d') ?? 'null').' diff='.($lastDate ? $current->diffInDays($lastDate) : '?')." streak=$streakDays\n";
        $lastDate = $current;
    }
    echo "  Final streak=$streakDays\n";
}

// Check what the seeder actually stored
$user = User::find(1);
echo "User 1 stored: streak_days={$user->streak_days}, last_activity_at={$user->last_activity_at}\n";
