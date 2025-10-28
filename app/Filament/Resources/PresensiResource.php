<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PresensiResource\Pages;
use App\Models\Presensi;
use App\Models\Kelas;
use App\Models\Pengguna;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PresensiResource extends Resource
{
    protected static ?string $model = Presensi::class;
    protected static ?string $navigationIcon = 'heroicon-o-clipboard';
    protected static ?string $navigationGroup = 'Kelas';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('id_peserta')
                ->label('Peserta')
                ->options(Pengguna::where('role', 'peserta')->pluck('name', 'id_pengguna'))
                ->searchable()
                ->required(),

            Forms\Components\Select::make('id_kelas')
                ->label('Kelas')
                ->options(Kelas::pluck('nama_kelas', 'id_kelas'))
                ->searchable()
                ->required(),
            Forms\Components\Group::make()
                ->label('Jadwal Absen')
                ->schema([
                    Forms\Components\TimePicker::make('jadwal.waktu')
                        ->label('Waktu')
                        ->required(),

                    Forms\Components\DatePicker::make('jadwal.tanggal')
                        ->label('Tanggal')
                        ->required(),
                ]),

            Forms\Components\Toggle::make('is_absen')
                ->label('Sudah Absen?')
                ->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('peserta.name')->label('Peserta'),
            Tables\Columns\TextColumn::make('kelas.nama_kelas')->label('Kelas'),
            Tables\Columns\TextColumn::make('jadwal.tanggal')
                ->label('Tanggal')
                ->date(),

            Tables\Columns\TextColumn::make('jadwal.waktu')
                ->label('Waktu'),

            Tables\Columns\IconColumn::make('is_absen')->label('Absen')->boolean(),
            Tables\Columns\TextColumn::make('created_at')->dateTime('d M Y H:i'),
        ])
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPresensis::route('/'),
            'create' => Pages\CreatePresensi::route('/create'),
            'edit' => Pages\EditPresensi::route('/{record}/edit'),
        ];
    }
}
