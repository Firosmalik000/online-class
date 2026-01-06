<?php

namespace App\Filament\Resources\PresensiResource\Pages;

use App\Filament\Resources\PresensiResource;
use App\Models\Jadwal;
use App\Models\Presensi;
use Filament\Resources\Pages\CreateRecord;

class CreatePresensi extends CreateRecord
{
    protected static string $resource = PresensiResource::class;
    
    protected static ?string $title = 'Tambah Presensi';

    protected function getCreateFormAction(): \Filament\Actions\Action
    {
        return parent::getCreateFormAction()
            ->label('Simpan Presensi');
    }

    protected function getCreateAnotherFormAction(): \Filament\Actions\Action
    {
        return parent::getCreateAnotherFormAction()
            ->label('Simpan & Buat Lagi');
    }

    protected function getCancelFormAction(): \Filament\Actions\Action
    {
        return parent::getCancelFormAction()
            ->label('Batal');
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Jangan buat record presensi di sini
        // Hanya return data kosong atau data minimal
        return [
            'id_kelas' => $data['id_kelas'],
            'id_peserta' => $data['id_peserta'],
            'id_jadwal' => 0, // temporary value
            'is_absen' => false,
        ];
    }

    protected function afterCreate(): void
    {
        $idKelas = $this->data['id_kelas'];
        $idPeserta = $this->data['id_peserta'];

        // Hapus record temporary
        Presensi::where('id', $this->record->id)->delete();

        // Ambil semua jadwal dari kelas yang dipilih
        $jadwalList = Jadwal::where('id_kelas', $idKelas)->get();

        // Buat presensi untuk setiap jadwal dengan is_absen = false (default)
        foreach ($jadwalList as $jadwal) {
            Presensi::create([
                'id_kelas' => $idKelas,
                'id_peserta' => $idPeserta,
                'id_jadwal' => $jadwal->id,
                'is_absen' => false,
            ]);
        }
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}