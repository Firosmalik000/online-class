<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Peserta extends Model
{
    protected $table = 'pesertas';
    protected $primaryKey = 'id_peserta';
    protected $fillable = ['id_peserta', 'nama', 'email', 'password', 'telepon', 'alamat', 'status', 'foto'];

    protected $guarded = ['id'];
    protected $hidden = [
        'password', 'remember_token',
    ];
    public function getAuthPassword()
    {
    return $this->password;
    }
}
