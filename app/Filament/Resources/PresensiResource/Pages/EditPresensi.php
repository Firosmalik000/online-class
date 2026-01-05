<?php

namespace App\Filament\Resources\PresensiResource\Pages;

use App\Filament\Resources\PresensiResource;
use App\Models\Presensi;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPresensi extends EditRecord
{
    protected static string $resource = PresensiResource::class;
    
    protected static ?string $title = 'Edit Presensi';

    protected function getSaveFormAction(): \Filament\Actions\Action
    {
        return parent::getSaveFormAction()
            ->label('Simpan Perubahan');
    }

    protected function getCancelFormAction(): \Filament\Actions\Action
    {
        return parent::getCancelFormAction()
            ->label('Batal');
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()->label('Hapus'),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Ambil semua presensi berdasarkan id_kelas & id_peserta
        $presensiList = Presensi::where('id_kelas', $data['id_kelas'])
            ->where('id_peserta', $data['id_peserta'])
            ->with('jadwal')
            ->get();

        $data['jadwal_list'] = $presensiList->map(function ($presensi) {
            return [
                'id' => $presensi->id,
                'tanggal' => $presensi->jadwal->tanggal->format('d-m-Y'),
                'waktu' => $presensi->jadwal->waktu->format('H:i'),
                'is_absen' => $presensi->is_absen,
            ];
        })->toArray();

        return $data;
    }

    protected function afterSave(): void
    {
        $jadwalList = $this->data['jadwal_list'] ?? [];

        foreach ($jadwalList as $jadwalData) {
            if (isset($jadwalData['id'])) {
                Presensi::where('id', $jadwalData['id'])
                    ->update([
                        'is_absen' => $jadwalData['is_absen'] ?? false,
                    ]);
            }
        }
    }
}