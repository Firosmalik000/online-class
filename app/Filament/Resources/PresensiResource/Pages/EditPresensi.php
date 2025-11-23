<?php

namespace App\Filament\Resources\PresensiResource\Pages;

use App\Filament\Resources\PresensiResource;
use App\Models\Jadwal;
use App\Models\Presensi;
use Filament\Resources\Pages\EditRecord;

class EditPresensi extends EditRecord
{
    protected static string $resource = PresensiResource::class;

    

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $jadwals = Jadwal::where('id_kelas', $data['id_kelas'])->get();

        $data['jadwal_list'] = $jadwals->map(function ($j) use ($data) {
            $presensi = Presensi::where('id_kelas', $data['id_kelas'])
                ->where('id_peserta', $data['id_peserta'])
                ->where('id_jadwal', $j->id)
                ->first();

            return [
                'id_jadwal' => $j->id,
                'tanggal'   => $j->tanggal->format('Y-m-d'),
                'waktu'     => $j->waktu->format('H:i'),
                'is_absen'  => $presensi?->is_absen ?? false,
            ];
        })->toArray();

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        foreach ($data['jadwal_list'] as $item) {

            if ($item['is_absen']) {
                // Jika absen TRUE → simpan atau update
                Presensi::updateOrCreate(
                    [
                        'id_kelas'   => $data['id_kelas'],
                        'id_peserta' => $data['id_peserta'],
                        'id_jadwal'  => $item['id_jadwal'],
                    ],
                    ['is_absen' => true]
                );
            } else {
                // Jika absen FALSE → hapus
                Presensi::where('id_kelas', $data['id_kelas'])
                    ->where('id_peserta', $data['id_peserta'])
                    ->where('id_jadwal', $item['id_jadwal'])
                    ->delete();
            }
        }

        unset($data['jadwal_list']);
        return $data;
    }
}
