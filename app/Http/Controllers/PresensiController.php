<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PresensiController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            Presensi::create([
                'id_peserta' => Auth::user()->id_pengguna,
                'id_kelas' => $request->id_kelas,
                'jadwal' => $request->jadwal,
                'is_absen' => true,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Presensi berhasil disimpan');
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
