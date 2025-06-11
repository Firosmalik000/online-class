<?php

namespace App\Http\Controllers;
use App\Models\Kelas;
use App\Models\Pembayaran;
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
    $kelas = Kelas::with('pengajar')->paginate(6); 
    $allKelas = Kelas::all(); 
    $kategori = [];

    foreach ($allKelas as $kls) {
        $kategoriList = explode(',', $kls->kategori);
        $kategori = array_merge($kategori, $kategoriList);
    }

    $kategori = array_unique($kategori);
    array_unshift($kategori, 'semua');

    $pembelian = Pembayaran::with('pendaftaran')
    ->get();

    $idKelasCounts = $pembelian->map(function ($item) {
        return optional($item->pendaftaran)->id_kelas;
    })->filter()->countBy();
    
    $top3IdKelas = $idKelasCounts->sortDesc()->take(3);
    $top3Detail = $top3IdKelas->map(function ($jumlah, $id_kelas) {
        $kelas = Kelas::with('pengajar')->find($id_kelas);
        return $kelas;
    })->values()->sortByDesc('jumlah'); 


    return Inertia::render('Welcome', [
        'kelas' => $kelas,
        'kategori' => array_values($kategori),
        'filters' => Request::only('page'), 
        'best_sellers' => $top3Detail
    ]);
}

   
    
}

