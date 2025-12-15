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

                Tables\Columns\TextColumn::make('finished_at')
                    ->label('Tanggal Selesai')
                    ->dateTime('d M Y H:i')
                    ->placeholder('-'),

            ])
            ->headerActions([])
            ->actions([
                Tables\Actions\Action::make('selesai')
                    ->label('Selesai')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Tandai Selesai')
                    ->modalDescription('Apakah Anda yakin ingin menandai kelas ini sebagai selesai?')
                    ->modalSubmitActionLabel('Ya, Selesai')
                    ->action(function ($record) {
                        $record->update([
                            'finished_at' => now(),
                            'status' => 'selesai',
                        ]);

                        Notification::make()
                            ->title('Berhasil')
                            ->body('Kelas telah ditandai sebagai selesai.')
                            ->success()
                            ->send();
                    })
                    ->disabled(fn($record) => $record->finished_at !== null)
                    ->hidden(fn($record) => $record->status === 'selesai'),
            ])
            ->bulkActions([])
            ->actionsColumnLabel('Aksi')
            ->actionsAlignment('left')
            ->actionsPosition(Tables\Enums\ActionsPosition::BeforeColumns);
    }
}
