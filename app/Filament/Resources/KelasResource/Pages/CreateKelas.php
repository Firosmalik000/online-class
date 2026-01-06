<?php

namespace App\Filament\Resources\KelasResource\Pages;

use App\Filament\Resources\KelasResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

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
        $jadwalList = $this->data['jadwal'];

        foreach ($jadwalList as $jadwalData) {
            $jadwal = \App\Models\Jadwal::create([
                'id_kelas' => $this->record->id_kelas,
                'tanggal' => $jadwalData['tanggal'],
                'waktu' => $jadwalData['waktu'],
            ]);

            // simpan materi
            if (!empty($jadwalData['materi'])) {
                foreach ($jadwalData['materi'] as $materiData) {
                    \App\Models\Materi::create([
                        'id_jadwal' => $jadwal->id,
                        'materi' => [
                            'content' => $materiData['materi'], // HTML rich editor
                        ],
                    ]);
                }
            }
        }
    }
}
