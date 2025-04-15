<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotasExamen extends Model
{
    protected $table = 'notas_examen';
    protected $fillable = [
        'examenId',
        'usuarioId',
        'nota',
    ];
}
