<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengajar extends Model
{
    protected $table = 'pengajar';

    protected $primaryKey = 'id_pengajar';

    protected $fillable = ['id_pengajar', 'nama', 'keahlian', 'foto'];
}
