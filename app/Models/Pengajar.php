<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengajar extends Model
{
    protected $table = 'pengajar';

    protected $primaryKey = 'id_pengajar';

    protected $fillable = ['id_pengajar', 'user_id', 'nama', 'keahlian', 'foto'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id_pengguna');
    }

    public function kelas()
    {
        return $this->hasMany(Kelas::class, 'id_pengajar', 'id_pengajar');
    }
}
