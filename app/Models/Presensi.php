<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presensi extends Model
{
    protected $table = 'presensi';

    protected $fillable = [
        'id_peserta',
        'id_kelas',
        'jadwal',
        'is_absen'
    ];

    protected $casts = [
        'jadwal' => 'array',
        'is_absen' => 'boolean',
    ];

    public function peserta()
    {
        return $this->belongsTo(Pengguna::class, 'id_peserta', 'id_pengguna');
    }
    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }
}
