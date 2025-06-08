<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'env' => [
                'midtrans_client_key' => config('midtrans.client_key'),
                'midtrans_server_key' => config('midtrans.server_key'),
                'midtrans_is_production' => config('midtrans.is_production'),
                'midtrans_is_sanitized' => config('midtrans.is_sanitized'),
                'midtrans_is_3ds' => config('midtrans.is_3ds'),
            ]
        ];
    }
}
