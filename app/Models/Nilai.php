<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nilai extends Model
{

    protected $table = 'nilai';

    protected $fillable = [
        'id_peserta',
        'id_kelas',
        'nilai',
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
