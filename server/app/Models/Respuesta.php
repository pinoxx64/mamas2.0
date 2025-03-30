<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Respuesta extends Model
{
    protected $fillable = [
        'respuesta',
        'preguntaId'
    ];

    public function pregunta()
    {
        return $this->belongsTo(Pregunta::class, 'preguntaId');
    }
}
