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

            if (is_array($jadwalObj) && count($jadwalObj) > 0) {
                // Gabungkan semua tanggal dan waktu menjadi satu string dipisahkan koma
                $jadwalDate = collect($jadwalObj)
                    ->map(fn($item) => $item['tanggal'] . ' ' . $item['waktu'])
                    ->implode(', ');
            } else {
                return redirect()->back()->with('error', 'Harap pilih jadwal terlebih dahulu');
            }


            $findPresensi = Presensi::where('id_kelas', $request->id_kelas)
                ->where('id_peserta', $userId)
                ->first();

            if (!$findPresensi) {
                Presensi::create([
                    'id_peserta' => $userId,
                    'id_kelas' => $request->id_kelas,
                    'jadwal' => $jadwalDate,
                    'is_absen' => true,
                ]);
            } else {
                $findPresensi->update([
                    'jadwal' => $jadwalDate,
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
