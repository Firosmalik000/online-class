<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    protected $table = 'kelas';
    protected $primaryKey = 'id_kelas';
    protected $fillable = ['id_kelas','id_pengajar', 'nama_kelas', 'deskripsi', 'jadwal', 'harga', 'level', 'link_zoom', 'kategori', 'banner'];

    protected $casts = [
        'kategori' => 'array',
    ];

    public function pengajar()
    {
        return $this->belongsTo(Pengajar::class, 'id_pengajar');
    }
}
