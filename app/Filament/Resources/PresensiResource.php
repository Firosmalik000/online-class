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
    protected static ?string $pluralModelLabel = 'Presensi Kelas';


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

            Forms\Components\Select::make('id_peserta')
                ->label('Peserta')
                ->options(function (callable $get) {
                    $idKelas = $get('id_kelas');

                    if (!$idKelas) {
                        return [];
                    }

                    $sudahAda = \App\Models\Presensi::where('id_kelas', $idKelas)
                        ->pluck('id_peserta');

                    return \App\Models\Pengguna::where('role', 'peserta')
                        ->whereNotIn('id_pengguna', $sudahAda)
                        ->pluck('name', 'id_pengguna');
                })
                ->getOptionLabelUsing(
                    fn($value) =>
                    \App\Models\Pengguna::find($value)?->name 
                )
                ->searchable()
                ->reactive()
                ->required(),

            Forms\Components\Repeater::make('jadwal')
                ->label('Daftar Jadwal Absen')
                ->schema([
                    Forms\Components\DatePicker::make('tanggal')
                        ->label('Tanggal')
                        ->required(),

                    Forms\Components\TimePicker::make('waktu')
                        ->label('Waktu')
                        ->withoutSeconds()
                        ->required(),

                    Forms\Components\RichEditor::make('keterangan')
                        ->label('Keterangan')
                        ->toolbarButtons(['bold', 'italic', 'underline', 'bulletList'])
                        ->columnSpanFull(),
                ])
                ->minItems(1)
                ->grid(2)
                ->collapsed()
                ->required()
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

                Tables\Columns\TextColumn::make('jumlah_jadwal')
                    ->label('Jumlah Jadwal')
                    ->badge()
                    ->getStateUsing(function ($record) {
                        $jadwalData = $record->jadwal;

                        if (!is_array($jadwalData) || empty($jadwalData)) {
                            return '0 Jadwal';
                        }

                        return count($jadwalData) . ' Jadwal';
                    })
                    ->color('success'),

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
