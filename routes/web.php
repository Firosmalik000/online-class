<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KursusKontroller;
use App\Http\Controllers\DetailController;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home.index');
Route::get('/kursus', [KursusKontroller::class, 'index'])->name('kursus.index');
Route::get('/detail/{id}', [DetailController::class, 'index'])->name('detail.index');
    
// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
