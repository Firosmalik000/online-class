<?php

namespace App\Filament\Resources\KelasResource\Pages;

use App\Filament\Resources\KelasResource;
use Filament\Actions;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditKelas extends EditRecord
{
    protected static string $resource = KelasResource::class;

    protected static ?string $title = 'Edit Kelas';

    protected function getSaveFormAction(): \Filament\Actions\Action
    {
        return parent::getSaveFormAction()
            ->label('Simpan Perubahan');
    }

    protected function getCancelFormAction(): Action
    {
        return parent::getCancelFormAction()->label('Batal');
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()->label('Hapus Kelas'),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $jadwal = $this->record->jadwal()
            ->with('materis')
            ->get();

        if ($jadwal->isEmpty()) {
            $data['jadwal'] = [];
            return $data;
        }

        $data['jadwal'] = $jadwal->map(function ($j) {
            return [
                'id'      => $j->id_jadwal,
                'tanggal' => $j->tanggal,
                'waktu'   => $j->waktu,

                'materi' => $j->materis->map(function ($m) {
                    return [
                        'id'                => $m->id_materi,
                        'judul'             => $m->judul,
                        'file'              => $m->filepath,
                        'original_filename' => $m->filename,
                    ];
                })->toArray(),
            ];
        })->toArray();

        return $data;
    }

    protected function afterSave(): void
    {
        $kelas = $this->record;
        $jadwalIdsToKeep = [];

        foreach ($this->data['jadwal'] ?? [] as $jadwalData) {

            // UPDATE atau CREATE jadwal
            $jadwal = isset($jadwalData['id']) && $jadwalData['id']
                ? $kelas->jadwal()->find($jadwalData['id'])
                : null;

            if ($jadwal) {
                $jadwal->update([
                    'tanggal' => $jadwalData['tanggal'],
                    'waktu' => $jadwalData['waktu'],
                ]);
            } else {
                $jadwal = $kelas->jadwal()->create([
                    'tanggal' => $jadwalData['tanggal'],
                    'waktu' => $jadwalData['waktu'],
                ]);
            }

            $jadwalIdsToKeep[] = $jadwal->id_jadwal;

            // ======== MATERI UPDATE ========
            $materiIdsToKeep = [];

            foreach ($jadwalData['materi'] ?? [] as $materiData) {
                $materi = isset($materiData['id']) && $materiData['id']
                    ? $jadwal->materi()->find($materiData['id'])
                    : null;

                $filepath = $materiData['file'] ?? null;
                
                // Convert array to string if needed
                if (is_array($filepath)) {
                    $filepath = $filepath[0] ?? null;
                }
                
                if (empty($filepath)) {
                    continue;
                }
                
                // Ambil original filename
                $originalFilename = $materiData['original_filename'] ?? null;
                if (is_array($originalFilename)) {
                    $originalFilename = $originalFilename[0] ?? basename($filepath);
                }
                if (empty($originalFilename)) {
                    $originalFilename = $materi ? $materi->filename : basename($filepath);
                }

                if ($materi) {
                    // Hapus file lama jika filepath berubah
                    if ($materi->filepath !== $filepath) {
                        if ($materi->filepath && Storage::disk('public')->exists($materi->filepath)) {
                            Storage::disk('public')->delete($materi->filepath);
                        }
                    }
                    
                    // UPDATE
                    $materi->update([
                        'judul' => $materiData['judul'],
                        'filename' => $originalFilename,
                        'filepath' => $filepath,
                    ]);
                } else {
                    // CREATE
                    $materi = $jadwal->materi()->create([
                        'judul' => $materiData['judul'],
                        'filename' => $originalFilename,
                        'filepath' => $filepath,
                    ]);
                }

                $materiIdsToKeep[] = $materi->id_materi;
            }

            // delete materi yang dihapus user (dan hapus filenya juga)
            $deletedMateri = $jadwal->materi()->whereNotIn('id_materi', $materiIdsToKeep)->get();
            foreach ($deletedMateri as $m) {
                if ($m->filepath && Storage::disk('public')->exists($m->filepath)) {
                    Storage::disk('public')->delete($m->filepath);
                }
                $m->delete();
            }
        }

        // delete jadwal yang dihapus user (dan materi + filenya)
        $deletedJadwal = $kelas->jadwal()->whereNotIn('id_jadwal', $jadwalIdsToKeep)->get();
        foreach ($deletedJadwal as $j) {
            foreach ($j->materi as $m) {
                if ($m->filepath && Storage::disk('public')->exists($m->filepath)) {
                    Storage::disk('public')->delete($m->filepath);
                }
            }
            $j->delete();
        }
    }
}