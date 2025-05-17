<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Pembayaran;

class PembayaranChart extends ChartWidget
{
    protected static ?string $heading = 'Pembayaran Chart';

    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $data = Pembayaran::where('status', 'Lunas')
            ->whereYear('created_at', date('Y'))
            ->selectRaw('SUM(total_harga) as total_harga')
            ->groupByRaw('MONTH(created_at)')
            ->orderByRaw('MONTH(created_at)')
            ->pluck('total_harga')
            ->toArray();
        return [
            'datasets' => [
                [
                    'label' => 'Pembayaran Lunas',
                    'data' => $data
                ]
            ],
            'labels' => [
                'Januari',
                'Februari',
                'Maret',
                'April',
                'Mei',
                'Juni',
                'Juli',
                'Agustus',
                'September',
                'Oktober',
                'November',
                'Desember'
            ]
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
