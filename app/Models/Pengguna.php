<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengguna extends Model
{
    protected $table = 'pengguna';
    protected $primaryKey = 'id_pengguna';
    protected $fillable = ['id_pengguna', 'name', 'email', 'password', 'role', 'foto'];


    public function presensis()
    {
        return $this->hasMany(Presensi::class, 'id_peserta', 'id_pengguna');
    }

    public function nilai()
    {
        return $this->hasMany(Nilai::class, 'id_peserta', 'id_pengguna');
    }
}
