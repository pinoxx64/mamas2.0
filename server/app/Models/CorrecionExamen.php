<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CorrecionExamen extends Model
{
    protected $table = 'correcion_examen';
    protected $fillable = [
        'respuestaId',
        'correcta',
    ];

    public function respuesta()
    {
        return $this->belongsTo(RespuestaExamen::class, 'respuestaId');
    }
}
