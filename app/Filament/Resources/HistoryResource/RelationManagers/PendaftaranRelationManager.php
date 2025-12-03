<?php

namespace App\Filament\Resources\HistoryResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class PendaftaranRelationManager extends RelationManager
{

    protected static string $relationship = 'pendaftaran';


    protected static ?string $title = 'Riwayat Kelas';


    public function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('kelas.nama_kelas')
                    ->label('Nama Kelas')
                    ->sortable()
                    ->getStateUsing(function ($record) {
                        if (!$record || !$record->kelas) {
                            return 'N/A';
                        }
                        return $record->kelas?->nama_kelas ?? 'N/A';
                    }),

                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'success' => 'selesai',
                        'danger' => 'dibatalkan',
                        'warning' => 'aktif',
                    ])
                    ->default('aktif'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tanggal Daftar')
                    ->dateTime('d M Y H:i'),    
            ])
            ->headerActions([])
            ->actions([])
            ->bulkActions([]);
    }
}
