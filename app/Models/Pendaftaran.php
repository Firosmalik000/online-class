<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pendaftaran extends Model
{
    protected $table = 'pendaftaran';

    protected $fillable = [
        'id_pendaftaran', 'id_peserta', 'id_kelas', 'status'
    ];

    protected $primaryKey = 'id_pendaftaran';
}
