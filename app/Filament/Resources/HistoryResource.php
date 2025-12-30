<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HistoryResource\Pages;
use App\Filament\Resources\HistoryResource\RelationManagers\PendaftaranRelationManager;
use App\Models\Pengguna;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class HistoryResource extends Resource
{
    protected static ?string $model = Pengguna::class;
    protected static ?string $navigationIcon = 'heroicon-o-clock';
    protected static ?string $navigationGroup = 'Akademik';
    protected static ?string $modelLabel = 'Riwayat Pendaftaran';
    protected static ?string $pluralModelLabel = 'History Pendaftaran';
    public static ?string $recordRouteKeyName = 'id_pengguna';

    public static function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(
                fn(Builder $query) =>
                $query->where('role', 'peserta')
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Peserta')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('pendaftaran_count')
                    ->label('Jumlah Kelas')
                    ->counts([
                        'pendaftaran' => function ($query) {
                            $query->where('status', '!=', 'dibatalkan');
                        }
                    ])
            ])
            ->filters([])
            ->actions([
                Tables\Actions\ViewAction::make()->label('Detail'),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            PendaftaranRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListHistories::route('/'),
            'view' => Pages\ViewHistory::route('/{record}'),
        ];
    }

    public static function canEditAny(): bool
    {
        return false;
    }
    public static function canCreate(): bool
    {
        return false;
    }
    public static function canDeleteAny(): bool
    {
        return false;
    }
}
