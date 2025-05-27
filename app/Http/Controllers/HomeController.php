<?php

namespace App\Http\Controllers;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $kelas = Kelas::with('pengajar')->get();
        $kategori = [];
    
        foreach ($kelas as $kls) {
            $kategoriList = explode(',', $kls->kategori); 
            $kategori = array_merge($kategori, $kategoriList); 
        }
    
        $kategori = array_unique($kategori); 
        array_unshift($kategori, 'semua');
    
        return Inertia::render('Welcome', [
            'kelas' => $kelas,
            'kategori' => array_values($kategori),
        ]);
    }
    
}
