<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    protected $fillable = [
        'nombre',
        'usuarioId',
        'usuarioId2',
        'mensajeId'
    ];
}
