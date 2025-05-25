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
Route::get('/order');
    


Route::middleware('auth')->group(function () {
    Route::get('/order', function () {
        return Inertia::render('Order');
    }); 
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
