<?php

namespace App\Filament\Resources\KelasResource\Pages;

use App\Filament\Resources\KelasResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Storage;

class CreateKelas extends CreateRecord
{
    protected static string $resource = KelasResource::class;

    protected static ?string $title = 'Buat Kelas Baru';

    protected function getCreateFormAction(): \Filament\Actions\Action
    {
        return parent::getCreateFormAction()
            ->label('Simpan Kelas');
    }

    protected function getCreateAnotherFormAction(): \Filament\Actions\Action
    {
        return parent::getCreateAnotherFormAction()
            ->label('Simpan & Buat Lagi');
    }
    
    protected function getCancelFormAction(): \Filament\Actions\Action
    {
        return parent::getCancelFormAction()->label('Batal');
    }

    protected function afterCreate(): void
    {
        $jadwalList = $this->data['jadwal'] ?? [];

        foreach ($jadwalList as $jadwalData) {
            $jadwal = \App\Models\Jadwal::create([
                'id_kelas' => $this->record->id_kelas,
                'tanggal' => $jadwalData['tanggal'],
                'waktu' => $jadwalData['waktu'],
            ]);

            // simpan materi
            if (!empty($jadwalData['materi'])) {
                foreach ($jadwalData['materi'] as $materiData) {
                    // File sudah diupload oleh Filament ke disk public
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
                        $originalFilename = basename($filepath);
                    }
                    
                    \App\Models\Materi::create([
                        'id_jadwal' => $jadwal->id_jadwal,
                        'judul' => $materiData['judul'],
                        'filename' => $originalFilename,
                        'filepath' => $filepath,
                    ]);
                }
            }
        }
    }
}