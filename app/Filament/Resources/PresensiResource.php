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

class PresensiResource extends Resource
{
    protected static ?string $model = Presensi::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard';
    protected static ?string $navigationGroup = 'Kelas';

    public static function form(Form $form): Form
    {
        return $form->schema([

            Forms\Components\Hidden::make('id_kelas'),
            Forms\Components\Hidden::make('id_peserta'),

            Forms\Components\Select::make('id_kelas')
                ->label('Kelas')
                ->options(Kelas::pluck('nama_kelas', 'id_kelas'))
                ->required()
                ->disabled(fn($context) => $context === 'edit')
                ->reactive() // ← Penting untuk trigger update peserta
                ->afterStateUpdated(fn($state, callable $set) => $set('id_peserta', null)), // Reset peserta saat kelas berubah

            Forms\Components\Select::make('id_peserta')
                ->label('Peserta')
                ->options(function ($context, callable $get) {
                    if ($context === 'create') {
                        $idKelas = $get('id_kelas');

                        // Jika belum pilih kelas, tampilkan semua peserta
                        if (!$idKelas) {
                            return Pengguna::where('role', 'peserta')
                                ->pluck('name', 'id_pengguna');
                        }

                        // Ambil id_peserta yang SUDAH ada presensi di kelas ini
                        $usedPeserta = Presensi::where('id_kelas', $idKelas)
                            ->distinct()
                            ->pluck('id_peserta')
                            ->toArray();

                        // Return peserta yang BELUM ada di kelas ini
                        return Pengguna::where('role', 'peserta')
                            ->whereNotIn('id_pengguna', $usedPeserta)
                            ->pluck('name', 'id_pengguna');
                    }

                    // Mode edit: tampilkan semua
                    return Pengguna::where('role', 'peserta')
                        ->pluck('name', 'id_pengguna');
                })
                ->required()
                ->disabled(fn($context) => $context === 'edit')
                ->helperText(function ($context, callable $get) {
                    if ($context === 'create' && !$get('id_kelas')) {
                        return 'Pilih kelas terlebih dahulu';
                    }
                    return null;
                }),

            Forms\Components\Repeater::make('jadwal_list')
                ->label('Daftar Jadwal')
                ->visible(fn($context) => $context === 'edit')
                ->schema([
                    Forms\Components\TextInput::make('tanggal')->disabled(),
                    Forms\Components\TextInput::make('waktu')->disabled(),
                    Forms\Components\Toggle::make('is_absen')->label('Sudah Absen?'),
                ])
                ->columns(3)
                ->addable(false)
                ->deletable(false)
                ->reorderable(false)
                ->defaultItems(0),
        ]);
    }
    
    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(function (Builder $query) {

                // Hapus ORDER BY otomatis Filament
                $query->getQuery()->orders = null;

                return $query
                    ->selectRaw('MIN(id) as id, id_kelas, id_peserta')
                    ->groupBy('id_kelas', 'id_peserta')
                    ->orderByRaw('MIN(id) asc');
            })
            ->columns([
                Tables\Columns\TextColumn::make('kelas.nama_kelas')
                    ->label('Kelas'),

                Tables\Columns\TextColumn::make('peserta.name')
                    ->label('Peserta'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListPresensis::route('/'),
            'create' => Pages\CreatePresensi::route('/create'),
            'edit'   => Pages\EditPresensi::route('/{record}/edit'),
        ];
    }
}
