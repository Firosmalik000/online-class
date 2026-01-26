<?php

namespace App\Http\Controllers;

use App\Models\Materi;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Pengajar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MateriController extends Controller
{
    /**
     * Upload materi PDF
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_jadwal' => 'required|exists:jadwal,id',
            'file' => 'required|file|mimes:pdf|max:10240', // Max 10MB
            'judul' => 'required|string|max:255',
        ]);

        $user = auth()->user();
        $pengajar = Pengajar::where('user_id', $user->id_pengguna)->first();

        if (!$pengajar) {
            return back()->with('error', 'Anda tidak memiliki akses');
        }

        // Verify jadwal belongs to pengajar's kelas
        $jadwal = Jadwal::with('kelas')->find($request->id_jadwal);
        if (!$jadwal || $jadwal->kelas->id_pengajar !== $pengajar->id_pengajar) {
            return back()->with('error', 'Jadwal tidak ditemukan atau Anda tidak memiliki akses');
        }

        // Store the file
        $file = $request->file('file');
        $originalFilename = $file->getClientOriginalName();
        $filename = time() . '_' . $originalFilename;
        $path = $file->storeAs('materi', $filename, 'public');

        // Create new materi record
        Materi::create([
            'id_jadwal' => $request->id_jadwal,
            'judul' => $request->judul,
            'filename' => $originalFilename,
            'filepath' => $path,
        ]);

        return back()->with('success', 'Materi berhasil diupload');
    }

    /**
     * Delete materi
     */
    public function destroy($id)
    {
        $user = auth()->user();
        $pengajar = Pengajar::where('user_id', $user->id_pengguna)->first();

        if (!$pengajar) {
            return back()->with('error', 'Anda tidak memiliki akses');
        }

        $materi = Materi::findOrFail($id);
        $jadwal = Jadwal::with('kelas')->find($materi->id_jadwal);

        if (!$jadwal || $jadwal->kelas->id_pengajar !== $pengajar->id_pengajar) {
            return back()->with('error', 'Anda tidak memiliki akses');
        }

        // Delete file from storage
        if ($materi->filepath) {
            Storage::disk('public')->delete($materi->filepath);
        }

        // Delete record
        $materi->delete();

        return back()->with('success', 'Materi berhasil dihapus');
    }

    /**
     * View materi (untuk pengajar)
     */
    public function view($id)
    {
        $materi = Materi::findOrFail($id);
        $path = storage_path('app/public/' . $materi->filepath);

        if (!file_exists($path)) {
            abort(404, 'File tidak ditemukan');
        }

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
        ]);
    }

    /**
     * Download materi (untuk siswa)
     */
    public function download($id)
    {
        $materi = Materi::findOrFail($id);
        $path = storage_path('app/public/' . $materi->filepath);

        if (!file_exists($path)) {
            abort(404, 'File tidak ditemukan');
        }

        return response()->download($path, $materi->filename);
    }
}
