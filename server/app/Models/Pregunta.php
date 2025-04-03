<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pregunta extends Model
{
    protected $table = 'pregunta';
    protected $fillable = [
        'tipo',
        'pregunta',
        'opciones',
        'asignaturaId',
    ];

    public function respuestas()
    {
        return $this->hasMany(Respuesta::class, 'preguntaId');
    }
    
    public function asignatura()
    {
        return $this->belongsTo(Asignatura::class, 'asignaturaId');
    }
}
