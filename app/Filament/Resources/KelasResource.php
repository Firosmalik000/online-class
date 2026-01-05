<?php

namespace App\Filament\Resources;

use App\Filament\Resources\KelasResource\Pages;
use App\Filament\Resources\KelasResource\RelationManagers;
use App\Models\Kelas;
use App\Models\Pengajar;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Support\RawJs;

class KelasResource extends Resource
{
    protected static ?string $model = Kelas::class;

    protected static ?string $navigationIcon = 'heroicon-s-academic-cap';

    protected static string $createButtonLabel = 'Kelas Baru';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('nama_kelas')->required(),
                Forms\Components\Select::make('id_pengajar')
                    ->label('Pengajar')
                    ->options(options: Pengajar::all()->pluck('nama', 'id_pengajar')->toArray())
                    ->searchable()
                    ->required(),
                Forms\Components\RichEditor::make('deskripsi')->columnSpan(2)->required(),
                Forms\Components\Repeater::make('jadwal')
                    ->label('Jadwal')
                    ->schema([
                        Forms\Components\Hidden::make('id'),
                        Forms\Components\DatePicker::make('tanggal')
                            ->label('Tanggal')
                            ->required(),

                        Forms\Components\TimePicker::make('waktu')
                            ->label('Waktu')
                            ->withoutSeconds()
                            ->required(),

                        Forms\Components\Repeater::make('materi')
                            ->label('Materi')
                            ->schema([
                                Forms\Components\RichEditor::make('materi')
                                    ->label('Materi')
                                    ->required()
                                    ->columnSpanFull(),
                                Forms\Components\Hidden::make('id'),

                            ])
                            ->minItems(1)
                            ->columns(1)
                            ->columnSpanFull()
                            ->addActionLabel('Tambah Materi'),
                    ])
                    ->minItems(1)
                    ->columns(2)
                    ->columnSpanFull()
                    ->required()
                    ->dehydrated(false)
                    ->addActionLabel('Tambah Jadwal'),
                Forms\Components\TextInput::make('harga')
                    ->label('Harga')
                    ->mask(RawJs::make(<<<'JS'
                        $input => {
                            let number = $input.replace(/[^0-9]/g, '');
                            return new Intl.NumberFormat('id-ID').format(number);
                        }
                    JS))
                    ->stripCharacters(['.', ',']) // optional
                    ->dehydrateStateUsing(fn($state) => (int) str_replace(['.', ','], '', $state))
                    ->numeric()
                    ->required(),
                Forms\Components\Select::make('level')
                    ->options([
                        'dasar' => 'Dasar',
                        'menengah' => 'Menengah',
                        'lanjutan' => 'Lanjutan',
                    ])->required(),
                Forms\Components\TagsInput::make('kategori')
                    ->suggestions([
                        'tailwindcss',
                        'alpinejs',
                        'laravel',
                        'livewire',
                    ])
                    ->separator(',')
                    ->required(),
                Forms\Components\TextInput::make('link_zoom')->required(),
                Forms\Components\FileUpload::make('banner')
                    ->directory('banner-kelas')
                    ->visibility('public')
                    ->columnSpan(2)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('banner')->visibility('public')->default('https://placehold.co/600x400?text=User+Name'),
                Tables\Columns\TextColumn::make('nama_kelas'),
                Tables\Columns\TextColumn::make('pengajar_id')->getStateUsing(fn(Kelas $record): string => $record->pengajar->nama),
                Tables\Columns\TextColumn::make('harga')->money('IDR'),
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
            'index' => Pages\ListKelas::route('/'),
            'create' => Pages\CreateKelas::route('/create'),
            'edit' => Pages\EditKelas::route('/{record}/edit'),
        ];
    }
}
