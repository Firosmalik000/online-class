<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Jadwal;
use App\Models\Materi;
use App\Models\Pengajar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengajarDashboardController extends Controller
{
    /**
     * Menampilkan dashboard pengajar
     */
    public function index()
    {
        $user = auth()->user();
        $pengajar = Pengajar::where('user_id', $user->id_pengguna)->first();

        if (!$pengajar) {
            return redirect()->route('home.index')->with('error', 'Anda bukan pengajar');
        }

        $kelasList = Kelas::where('id_pengajar', $pengajar->id_pengajar)
            ->with(['jadwal.materis', 'pendaftaran.peserta'])
            ->get();

        // Hitung statistik
        $totalKelas = $kelasList->count();
        $totalSiswa = $kelasList->sum(function ($kelas) {
            return $kelas->pendaftaran->where('status', 'aktif')->count();
        });
        $totalJadwal = $kelasList->sum(function ($kelas) {
            return $kelas->jadwal->count();
        });

        return Inertia::render('Pengajar/Dashboard', [
            'pengajar' => $pengajar,
            'kelasList' => $kelasList,
            'stats' => [
                'totalKelas' => $totalKelas,
                'totalSiswa' => $totalSiswa,
                'totalJadwal' => $totalJadwal,
            ]
        ]);
    }

    /**
     * Menampilkan daftar kelas pengajar
     */
    public function kelas()
    {
        $user = auth()->user();
        $pengajar = Pengajar::where('user_id', $user->id_pengguna)->first();

        if (!$pengajar) {
            return redirect()->route('home.index')->with('error', 'Anda bukan pengajar');
        }

        $kelasList = Kelas::where('id_pengajar', $pengajar->id_pengajar)
            ->with(['jadwal.materis', 'pendaftaran.peserta'])
            ->get();

        return Inertia::render('Pengajar/Kelas', [
            'pengajar' => $pengajar,
            'kelasList' => $kelasList,
        ]);
    }

    /**
     * Menampilkan detail kelas
     */
    public function detailKelas($id)
    {
        $user = auth()->user();
        $pengajar = Pengajar::where('user_id', $user->id_pengguna)->first();

        if (!$pengajar) {
            return redirect()->route('home.index')->with('error', 'Anda bukan pengajar');
        }

        $kelas = Kelas::where('id_kelas', $id)
            ->where('id_pengajar', $pengajar->id_pengajar)
            ->with(['jadwal.materis', 'pendaftaran.peserta', 'presensis'])
            ->firstOrFail();

        return Inertia::render('Pengajar/DetailKelas', [
            'pengajar' => $pengajar,
            'kelas' => $kelas,
        ]);
    }

    /**
     * Menampilkan jadwal pengajar
     */
    public function jadwal()
    {
        $user = auth()->user();
        $pengajar = Pengajar::where('user_id', $user->id_pengguna)->first();

        if (!$pengajar) {
            return redirect()->route('home.index')->with('error', 'Anda bukan pengajar');
        }

        $kelasList = Kelas::where('id_pengajar', $pengajar->id_pengajar)
            ->with(['jadwal.materis'])
            ->get();

        // Flatten jadwal dari semua kelas
        $jadwalList = collect();
        foreach ($kelasList as $kelas) {
            foreach ($kelas->jadwal as $jadwal) {
                $jadwalList->push([
                    'id' => $jadwal->id,
                    'id_kelas' => $kelas->id_kelas,
                    'nama_kelas' => $kelas->nama_kelas,
                    'tanggal' => $jadwal->tanggal,
                    'waktu' => $jadwal->waktu,
                    'link_zoom' => $kelas->link_zoom,
                    'materis' => $jadwal->materis,
                ]);
            }
        }

        // Sort by date
        $jadwalList = $jadwalList->sortBy('tanggal')->values();

        return Inertia::render('Pengajar/Jadwal', [
            'pengajar' => $pengajar,
            'jadwalList' => $jadwalList,
        ]);
    }

    /**
     * Menampilkan halaman materi
     */
    public function materi()
    {
        $user = auth()->user();
        $pengajar = Pengajar::where('user_id', $user->id_pengguna)->first();

        if (!$pengajar) {
            return redirect()->route('home.index')->with('error', 'Anda bukan pengajar');
        }

        $kelasList = Kelas::where('id_pengajar', $pengajar->id_pengajar)
            ->with(['jadwal.materis'])
            ->get();

        return Inertia::render('Pengajar/Materi', [
            'pengajar' => $pengajar,
            'kelasList' => $kelasList,
        ]);
    }
}
