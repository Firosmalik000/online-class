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

            $jadwalObj = (array) $request->jadwal;

            $filteredJadwal = collect($jadwalObj)
                ->map(fn($item) => [
                    'tanggal' => $item['tanggal'],
                    'waktu' => $item['waktu'],
                ])
                ->values(); // reset index

            $jadwalJson = $filteredJadwal->toJson();


            $findPresensi = Presensi::where('id_kelas', $request->id_kelas)
                ->where('id_peserta', $userId)
                ->first();

            if (!$findPresensi) {
                Presensi::create([
                    'id_peserta' => $userId,
                    'id_kelas' => $request->id_kelas,
                    'jadwal' => $filteredJadwal,
                    'is_absen' => true,
                ]);
            } else {
                $findPresensi->update([
                    'jadwal' => $filteredJadwal,
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
