<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Pengajar;
use App\Models\Peserta;
use App\Models\Pendaftaran;
use App\Models\Pegawai;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Pengajar', Pengajar::all()->count())->color('primary'),
            Stat::make('Peserta', Peserta::all()->count())->color('warning'),
            Stat::make('Pegawai', Pegawai::all()->count())->color('danger'),
            Stat::make('Pendaftaran', Pendaftaran::all()->count())->color('success'),
        ];
    }
}
