<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PresensiResource\Pages;
use App\Models\Presensi;
use App\Models\Kelas;
use App\Models\Pengguna;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class PresensiResource extends Resource
{
    protected static ?string $model = Presensi::class;
    protected static ?string $navigationIcon = 'heroicon-o-clipboard';
    protected static ?string $navigationGroup = 'Kelas';
    protected static ?string $navigationLabel = 'Presensi Kelas';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('id_kelas')
                ->label('Kelas')
                ->options(function () {
                    $user = Auth::user();

                    if ($user && $user->role === 'pengajar') {
                        return Kelas::where('id_pengajar', $user->id_pengguna)
                            ->pluck('nama_kelas', 'id_kelas');
                    }

                    return Kelas::pluck('nama_kelas', 'id_kelas');
                })
                ->searchable()
                ->required(),

            // Pilih peserta
            Forms\Components\Select::make('id_peserta')
                ->label('Peserta')
                ->options(Pengguna::where('role', 'peserta')->pluck('name', 'id_pengguna'))
                ->searchable()
                ->required(),

            // Jadwal absen
            Forms\Components\Repeater::make('jadwal')
                ->label('Jadwal')
                ->columnSpan(2)
                ->schema([
                    Forms\Components\TextInput::make('tanggal')
                        ->label('Tanggal')
                        ->type('date')
                        ->required(),
                    Forms\Components\TextInput::make('waktu')
                        ->label('Waktu')
                        ->type('time')
                        ->required()
                ])
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(function (Builder $query) {
                $user = Auth::user();

                if ($user && $user->role === 'pengajar') {
                    $query->whereHas('kelas', function ($q) use ($user) {
                        $q->where('id_pengajar', $user->id_pengguna);
                    });
                }
            })
            ->columns([
                Tables\Columns\TextColumn::make('kelas.nama_kelas')
                    ->label('Kelas')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('peserta.name')
                    ->label('Peserta')
                    ->sortable()
                    ->searchable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('id_kelas')
                    ->label('Filter Kelas')
                    ->options(Kelas::pluck('nama_kelas', 'id_kelas')),
            ])
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
