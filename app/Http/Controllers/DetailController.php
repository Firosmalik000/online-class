<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DetailController extends Controller
{
    public function index(Request $request, $id)
    {
        $kelas = Kelas::with('pengajar','jadwal.materi')->where('id_kelas', $id)->first();

        return Inertia::render('Detail', [
            'kelas' => $kelas,
        ]);
    }
}
