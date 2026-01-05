<?php

namespace App\Filament\Resources\PendaftaranResource\Pages;

use App\Filament\Resources\PendaftaranResource;
use App\Models\Pembayaran;
use App\Models\Kelas;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreatePendaftaran extends CreateRecord
{
    protected static string $resource = PendaftaranResource::class;
    
    protected static ?string $title = 'Tambah Pendaftaran';

    protected function getCreateFormAction(): \Filament\Actions\Action
    {
        return parent::getCreateFormAction()
            ->label('Simpan Pendaftaran');
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

    protected function afterCreate(): void
    {
        // Ambil data kelas untuk mendapatkan harga
        $kelas = Kelas::find($this->record->id_kelas);
        
        if ($kelas) {
            // Generate kode pembayaran unik
            $kode = 'PAY-' . strtoupper(uniqid());
            
            // Buat pembayaran otomatis
            Pembayaran::create([
                'id_pendaftaran' => $this->record->id_pendaftaran,
                'kode' => $kode,
                'status' => 'belum',
                'metode' => null,
                'total_harga' => $kelas->harga,
            ]);
        }
    }
}