<?php

namespace App\Filament\Resources\KelasResource\Pages;

use App\Filament\Resources\KelasResource;
use Filament\Actions;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;

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
            ->with('materi')
            ->get();

        if ($jadwal->isEmpty()) {
            $data['jadwal'] = [];
            return $data;
        }

        $data['jadwal'] = $jadwal->map(function ($j) {
            return [
                'id'      => $j->id, // ← ID jadwal
                'tanggal' => $j->tanggal,
                'waktu'   => $j->waktu,

                'materi' => $j->materi->map(function ($m) {

                    $value = $m->materi;

                    if ($value === null) {
                        return [
                            'id'     => $m->id, // ← ID materi
                            'materi' => '',
                        ];
                    }

                    if (is_string($value)) {
                        $decoded = json_decode($value, true);

                        if (json_last_error() === JSON_ERROR_NONE) {
                            $value = $decoded;
                        }
                    }

                    return [
                        'id'     => $m->id, // ← ID materi
                        'materi' => is_array($value) ? ($value['content'] ?? '') : $value,
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

        foreach ($this->data['jadwal'] as $jadwalData) {

            // UPDATE atau CREATE
            $jadwal = isset($jadwalData['id'])
                ? $kelas->jadwal()->find($jadwalData['id'])
                : $kelas->jadwal()->create([
                    'tanggal' => $jadwalData['tanggal'],
                    'waktu' => $jadwalData['waktu'],
                ]);

            if (isset($jadwalData['id'])) {
                $jadwal->update([
                    'tanggal' => $jadwalData['tanggal'],
                    'waktu' => $jadwalData['waktu'],
                ]);
            }

            $jadwalIdsToKeep[] = $jadwal->id;

            // ======== MATERI UPDATE ========
            $materiIdsToKeep = [];

            foreach ($jadwalData['materi'] ?? [] as $materiData) {

                $materi = isset($materiData['id'])
                    ? $jadwal->materi()->find($materiData['id'])
                    : $jadwal->materi()->create([
                        'materi' => [
                            'content' => $materiData['materi'],
                        ],
                    ]);

                if (isset($materiData['id'])) {
                    $value = [
                        'content' => $materiData['materi'],
                    ];
                    $materi->update(['materi' => $value]);
                }

                $materiIdsToKeep[] = $materi->id;
            }

            // delete materi yang dihapus user
            $jadwal->materi()->whereNotIn('id', $materiIdsToKeep)->delete();
        }

        // delete jadwal yang dihapus user
        $kelas->jadwal()->whereNotIn('id', $jadwalIdsToKeep)->delete();
    }
}
