<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Examen extends Model
{
    protected $table = 'examen';
    protected $fillable = [
        'nombre',
        'fhInicio',
        'fhFinal',
        'usuarioId',
        'asignaturaId',
        'active'
    ];

    public function preguntas()
    {
        return $this->belongsToMany(Pregunta::class, 'examen_pregunta', 'examenId', 'preguntaId');
    }

    public function asignatura()
    {
        return $this->belongsTo(Asignatura::class, 'asignaturaId');
    }
    
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuarioId');
    }

    public function respuestasExamen()
    {
        return $this->hasMany(RespuestaExamen::class, 'examenId');
    }
}
