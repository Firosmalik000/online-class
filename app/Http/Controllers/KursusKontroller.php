<?php

namespace App\Http\Controllers;
use App\Models\Kelas;
// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class KursusKontroller extends Controller
{
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
    
        return Inertia::render('Kursus', [
            'kelas' => $kelas,
            'kategori' => array_values($kategori),
            'filters' => Request::only('page'),
        ]);
    }
}
