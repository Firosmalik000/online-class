<?php

namespace App\Http\Controllers;
use App\Models\Pendaftaran;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PendaftaranController extends Controller
{
    public function index(Request $request, $id_kelas)
    {
        $kelas = Kelas::with('pengajar')->where('id_kelas', $id_kelas)->first();
        return Inertia::render('Order', [
            'kelas' => $kelas,
        ]);
    }
    public function store(Request $request, $id_kelas)
    {
        try {
            $pendaftaran = new Pendaftaran();
            $pendaftaran->id_peserta =  auth()->id();
            ;
            $pendaftaran->id_kelas = $id_kelas;
            $pendaftaran->status = 'aktif';
            $pendaftaran->save();

            return response()->json(['message' => 'Pendaftaran Berhasil', 'success' => true, 'status' => 201], 201);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
