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

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-check';
    protected static ?string $navigationGroup = 'Kelas';
    protected static ?string $navigationLabel = 'Presensi';
    protected static ?string $modelLabel = 'Presensi';
    protected static ?string $pluralModelLabel = 'Presensi';

    public static function form(Form $form): Form
    {
        return $form->schema([

            Forms\Components\Select::make('id_kelas')
                ->label('Kelas')
                ->options(Kelas::pluck('nama_kelas', 'id_kelas'))
                ->required()
                ->disabled(fn($context) => $context === 'edit')
                ->reactive()
                ->afterStateUpdated(fn($state, callable $set) => $set('id_peserta', null)),

            Forms\Components\Select::make('id_peserta')
                ->label('Peserta')
                ->options(function ($context, callable $get) {
                    if ($context === 'create') {
                        $idKelas = $get('id_kelas');

                        if (!$idKelas) {
                            return Pengguna::where('role', 'peserta')
                                ->pluck('name', 'id_pengguna');
                        }

                        $usedPeserta = Presensi::where('id_kelas', $idKelas)
                            ->distinct()
                            ->pluck('id_peserta')
                            ->toArray();

                        return Pengguna::where('role', 'peserta')
                            ->whereNotIn('id_pengguna', $usedPeserta)
                            ->pluck('name', 'id_pengguna');
                    }

                    return Pengguna::where('role', 'peserta')
                        ->pluck('name', 'id_pengguna');
                })
                ->required()
                ->searchable()
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
                    Forms\Components\Hidden::make('id'),
                    Forms\Components\TextInput::make('tanggal')
                        ->label('Tanggal')
                        ->disabled(),
                    Forms\Components\TextInput::make('waktu')
                        ->label('Waktu')
                        ->disabled(),
                    Forms\Components\Toggle::make('is_absen')
                        ->label('Hadir')
                        ->inline(false),
                ])
                ->columns(3)
                ->addable(false)
                ->deletable(false)
                ->reorderable(false)
                ->defaultItems(0)
                ->columnSpanFull(),
        ]);
    }
    
    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(function (Builder $query) {
                $query->getQuery()->orders = null;

                return $query
                    ->selectRaw('MIN(id) as id, id_kelas, id_peserta')
                    ->groupBy('id_kelas', 'id_peserta')
                    ->orderByRaw('MIN(id) asc');
            })
            ->columns([
                Tables\Columns\TextColumn::make('kelas.nama_kelas')
                    ->label('Kelas')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('peserta.name')
                    ->label('Nama Peserta')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('total_hadir')
                    ->label('Total Kehadiran')
                    ->getStateUsing(function ($record) {
                        return Presensi::where('id_kelas', $record->id_kelas)
                            ->where('id_peserta', $record->id_peserta)
                            ->where('is_absen', true)
                            ->count();
                    })
                    ->alignCenter(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label('Edit'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()->label('Hapus'),
                ]),
            ])
            ->searchPlaceholder('Cari kelas atau peserta...');
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