<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KursusKontroller;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\PendaftaranController;
use App\Http\Controllers\PresensiController;
use App\Http\Controllers\PengajarDashboardController;
use App\Http\Controllers\MateriController;

// use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home.index');
Route::get('/kursus', [KursusKontroller::class, 'index'])->name('kursus.index');
Route::get('/detail/{id}', [DetailController::class, 'index'])->name('detail.index');

Route::middleware('auth')->group(function () {
    // Route::get('/order', function () {
    //     return Inertia::render('Order');
    // });
    Route::post('/checkout', [PendaftaranController::class, 'update'])->name('pendaftaran.update');
    Route::get('/order', [PendaftaranController::class, 'index'])->name('order.index');
    Route::get('/course', [PendaftaranController::class, 'myCourse'])->name('course.myCourse');
    Route::post('/order/{id_kelas}', [PendaftaranController::class, 'store'])->name('order.store');
    Route::get('/order/{id}', [PendaftaranController::class, 'detail'])->name('order.detail');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/absence', [PresensiController::class, 'store'])->name('presensi.store');

    // Download materi (untuk siswa)
    Route::get('/materi/{id}/download', [MateriController::class, 'download'])->name('materi.download');
});

// Pengajar Routes
Route::middleware(['auth'])->prefix('pengajar')->name('pengajar.')->group(function () {
    Route::get('/dashboard', [PengajarDashboardController::class, 'index'])->name('dashboard');
    Route::get('/kelas', [PengajarDashboardController::class, 'kelas'])->name('kelas');
    Route::get('/kelas/{id}', [PengajarDashboardController::class, 'detailKelas'])->name('kelas.detail');
    Route::get('/jadwal', [PengajarDashboardController::class, 'jadwal'])->name('jadwal');
    Route::get('/materi', [PengajarDashboardController::class, 'materi'])->name('materi');

    // Materi upload/delete/view
    Route::post('/materi', [MateriController::class, 'store'])->name('materi.store');
    Route::get('/materi/{id}/view', [MateriController::class, 'view'])->name('materi.view');
    Route::delete('/materi/{id}', [MateriController::class, 'destroy'])->name('materi.destroy');
});

// Route::middleware('admin')->group(function () {
//     Route::get('/admin', function () {
//         return redirect()->route('filament.admin.resources');
//     })->name('admin.dashboard');
// });
require __DIR__ . '/auth.php';
