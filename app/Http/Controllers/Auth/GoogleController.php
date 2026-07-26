<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->scopes([
                'openid',
                'profile',
                'email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ])
            ->redirect();
    }

    public function callback(): RedirectResponse
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $avatar = $googleUser->getAvatar();
        if (! $avatar && $googleUser->token) {
            $response = Http::withToken($googleUser->token)
                ->get('https://www.googleapis.com/oauth2/v3/userinfo');
            $avatar = $response->json('picture');
        }

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            $user->forceFill([
                'google_id' => $user->google_id ?? $googleUser->getId(),
                'avatar' => $avatar,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ])->save();
        } else {
            $user = (new User)->forceFill([
                'name' => $googleUser->getName() ?? $googleUser->getNickname(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar' => $avatar,
                'email_verified_at' => now(),
                'password' => Hash::make(Str::random(40)),
            ]);
            $user->save();
        }

        Auth::login($user, remember: true);

        request()->session()->regenerate();

        return redirect()->intended(route('student.dashboard'));
    }
}
