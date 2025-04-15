<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RespuestaExamen extends Model
{
    protected $table = 'respuesta_examen';
    protected $fillable = [
        'examenId',
        'preguntaId',
        'usuarioId',
        'respuesta',
    ];
}
