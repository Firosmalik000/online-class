<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    protected $table = 'jadwal';
    protected $fillable = ['id_kelas', 'tanggal', 'waktu'];

    protected $casts = [
        'tanggal' => 'date',
        'waktu' => 'datetime:H:i:s',
    ];

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }

    public function materi()
    {
        return $this->hasMany(Materi::class, 'id_jadwal', 'id');
    }

    public function presensis()
    {
        return $this->hasMany(Presensi::class, 'id_jadwal', 'id');
    }
}