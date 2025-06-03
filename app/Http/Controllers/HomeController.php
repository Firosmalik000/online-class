<?php

namespace App\Http\Controllers;
use App\Models\Kelas;
use Inertia\Inertia;
use Illuminate\Support\Facades\Request;

class HomeController extends Controller
{
//     public function index()
//     {
//         $kelas = Kelas::with('pengajar')->get();
//         $kategori = [];
    
//         foreach ($kelas as $kls) {
//             $kategoriList = explode(',', $kls->kategori); 
//             $kategori = array_merge($kategori, $kategoriList); 
//         }
    
//         $kategori = array_unique($kategori); 
//         array_unshift($kategori, 'semua');
    
//         return Inertia::render('Welcome', [
//             'kelas' => $kelas,
//             'kategori' => array_values($kategori),
//         ]);
//     }
public function index()
{
    $kelas = Kelas::with('pengajar')->paginate(6); // ubah jumlah sesuai kebutuhan

    // Ambil kategori dari semua data (tanpa pagination) atau dari paginated data jika tidak masalah
    $allKelas = Kelas::all(); 
    $kategori = [];

    foreach ($allKelas as $kls) {
        $kategoriList = explode(',', $kls->kategori);
        $kategori = array_merge($kategori, $kategoriList);
    }

    $kategori = array_unique($kategori);
    array_unshift($kategori, 'semua');

    return Inertia::render('Welcome', [
        'kelas' => $kelas,
        'kategori' => array_values($kategori),
        'filters' => Request::only('page'), // agar state URL tetap terjaga
    ]);
}
    
}

