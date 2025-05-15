<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pegawai extends Model
{
    protected $table = 'pegawais';
    protected $primaryKey = 'id_pegawai';
    protected $fillable = ['id_pegawai', 'name', 'email', 'password', 'role', 'foto'];
}
