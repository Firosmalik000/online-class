<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PengajarResource\Pages;
use App\Filament\Resources\PengajarResource\RelationManagers;
use App\Models\Pengajar;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PengajarResource extends Resource
{
    protected static ?string $model = Pengajar::class;

    protected static ?string $navigationLabel = 'Pengajar';

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $navigationGroup = 'Manajemen Pengguna';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->label('Akun Pengguna')
                    ->options(function (?Pengajar $record) {
                        // Ambil user dengan role 'pengajar' yang belum terhubung ke pengajar lain
                        $query = User::where('role', 'pengajar');
                        
                        // Jika edit, include user yang sudah terhubung dengan record ini
                        if ($record && $record->user_id) {
                            $query->where(function ($q) use ($record) {
                                $q->whereNotIn('id_pengguna', function ($subQuery) use ($record) {
                                    $subQuery->select('user_id')
                                        ->from('pengajar')
                                        ->whereNotNull('user_id')
                                        ->where('id_pengajar', '!=', $record->id_pengajar);
                                })
                                ->orWhere('id_pengguna', $record->user_id);
                            });
                        } else {
                            $query->whereNotIn('id_pengguna', function ($subQuery) {
                                $subQuery->select('user_id')
                                    ->from('pengajar')
                                    ->whereNotNull('user_id');
                            });
                        }
                        
                        return $query->pluck('name', 'id_pengguna');
                    })
                    ->searchable()
                    ->preload()
                    ->required()
                    ->reactive()
                    ->afterStateUpdated(function ($state, callable $set) {
                        if ($state) {
                            $user = User::find($state);
                            if ($user) {
                                $set('nama', $user->name);
                            }
                        }
                    })
                    ->helperText('Pilih dari pengguna dengan role "pengajar"')
                    ->columnSpan(2),
                Forms\Components\TextInput::make('nama')->required(),
                Forms\Components\TextInput::make('keahlian')->required(),
                Forms\Components\FileUpload::make('foto')
                    ->directory('foto-pengajar')
                    ->visibility('public')
                    ->columnSpan(2)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('foto')->circular()->visibility('public')->default('https://placehold.co/600x400?text=User+Name'),
                Tables\Columns\TextColumn::make('nama'),
                Tables\Columns\TextColumn::make('keahlian'),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Akun Terhubung')
                    ->default('-')
                    ->badge()
                    ->color('success'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPengajars::route('/'),
            'create' => Pages\CreatePengajar::route('/create'),
            'edit' => Pages\EditPengajar::route('/{record}/edit'),
        ];
    }
}
