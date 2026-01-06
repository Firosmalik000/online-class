<?php

namespace App\Filament\Resources\HistoryResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Notifications\Notification;

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
            ->modifyQueryUsing(
                fn($query) => $query->where('status', '!=', 'dibatalkan')
            )
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

                Tables\Columns\SelectColumn::make('status')
                    ->options([
                        'aktif' => 'Aktif',
                        'selesai' => 'Selesai',
                    ])
                    ->afterStateUpdated(function ($record, $state) {
                        if ($state === 'selesai' && !$record->finished_at) {
                            $record->update([
                                'finished_at' => now(),
                            ]);
                        } elseif ($state === 'aktif' && $record->finished_at) {
                            $record->update([
                                'finished_at' => null,
                            ]);
                        }

                        Notification::make()
                            ->title('Berhasil')
                            ->body('Status berhasil diperbarui.')
                            ->success()
                            ->send();
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tanggal Daftar')
                    ->dateTime('d M Y H:i'),

                Tables\Columns\TextColumn::make('finished_at')
                    ->label('Tanggal Selesai')
                    ->dateTime('d M Y H:i')
                    ->placeholder('-'),

            ])
            ->headerActions([])
            ->actions([])
            ->bulkActions([]);
    }
}