<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage; // Penting: Import Storage facade

class ProfileController extends Controller
{
 
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => $request->user()->only('id', 'name', 'email', 'alamat', 'telepon', 'foto', 'profile_photo_url'),
        ]);
    }

    
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {

        $user = $request->user();

        $validatedData = $request->validated();

        if ($request->hasFile('foto')) {
            if ($user->foto && Storage::disk('public')->exists($user->foto)) {
                Storage::disk('public')->delete($user->foto);
            }

            $path = $request->file('foto')->store('profile-photos', 'public');
            $validatedData['foto'] = $path; 
        } elseif (array_key_exists('foto', $validatedData) && is_null($validatedData['foto'])) {
             if ($user->foto && Storage::disk('public')->exists($user->foto)) {
                 Storage::disk('public')->delete($user->foto);
             }
             $validatedData['foto'] = null; 
        }


        $user->fill($validatedData);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

   
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}