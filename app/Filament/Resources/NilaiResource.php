<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NilaiResource\Pages;
use App\Models\Nilai;
use App\Models\Kelas;
use App\Models\Pengguna;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class NilaiResource extends Resource
{
    protected static ?string $model = Nilai::class;

    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $navigationLabel = 'Nilai Peserta';
    protected static ?string $navigationGroup = 'Akademik';
    protected static ?string $modelLabel = 'Nilai Peserta';
    protected static ?string $pluralModelLabel = 'Nilai Peserta';

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
                ->required()
                ->reactive(),

            Forms\Components\Select::make('id_peserta')
                ->label('Peserta')
                ->options(function (callable $get) {
                    $idKelas = $get('id_kelas');

                    if (!$idKelas) {
                        return [];
                    }

                    $sudahAda = Nilai::where('id_kelas', $idKelas)->pluck('id_peserta');
                    return Pengguna::where('role', 'peserta')
                        ->whereNotIn('id_pengguna', $sudahAda)
                        ->pluck('name', 'id_pengguna');
                })
                ->getOptionLabelUsing(
                    fn($value) =>
                    \App\Models\Pengguna::find($value)?->name
                )
                ->searchable()
                ->required()
                ->reactive(),
            Forms\Components\TextInput::make('nilai')
                ->label('Nilai')
                // ->numeric()
                ->minValue(0)
                ->maxValue(100)
                ->required(),
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

                Tables\Columns\TextColumn::make('nilai')
                    ->label('Nilai')
                    ->sortable()
                    ->badge()
                    ->color(fn(int $state): string => match (true) {
                        $state >= 90 => 'success',
                        $state >= 75 => 'info',
                        $state >= 60 => 'warning',
                        default => 'danger',
                    }),
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
            ])
            ->defaultSort('id', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNilais::route('/'),
            'create' => Pages\CreateNilai::route('/create'),
            'edit' => Pages\EditNilai::route('/{record}/edit'),
        ];
    }
}
