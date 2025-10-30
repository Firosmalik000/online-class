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
            $userId = Auth::user()->id_pengguna;

            $findPresensi = Presensi::where('id_kelas', $request->id_kelas)
                ->where('id_peserta', $userId)
                ->first();

            if (!$findPresensi) {
                Presensi::create([
                    'id_peserta' => $userId,
                    'id_kelas' => $request->id_kelas,
                    'jadwal' => $request->jadwal,
                    'is_absen' => true,
                ]);
            } else {
                $findPresensi->update([
                    'jadwal' => $request->jadwal,
                    'is_absen' => true,
                ]);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Presensi berhasil disimpan');
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
