<?php

namespace App\Filament\Resources\HistoryResource\Pages;

use App\Filament\Resources\HistoryResource;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Database\Eloquent\Model;


class ViewHistory extends ViewRecord
{
    protected static string $resource = HistoryResource::class;

    protected function getRelations(): array
    {
        return HistoryResource::getRelations();
    }

    public function getRecord(): Model
    {
        $record = parent::getRecord();
        $record->load(['pendaftaran' => function ($query) {
            $query->with('kelas');
        }]);
        return $record;
    }
}
