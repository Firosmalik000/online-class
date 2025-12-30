<?php

namespace App\Filament\Resources\HistoryResource\Pages;

use App\Filament\Resources\HistoryResource;
use App\Models\Pendaftaran;
use Filament\Resources\Pages\EditRecord;

class EditHistory extends EditRecord
{
    protected static string $resource = HistoryResource::class;

    public function mount(int|string $record): void
    {
        // Find the first pendaftaran record for this peserta
        $this->record = Pendaftaran::where('id_peserta', $record)->firstOrFail();
        
        $this->authorizeAccess();
    }
}