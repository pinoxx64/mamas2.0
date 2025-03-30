<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asignatura extends Model
{
    protected $fillable = [
        'nombre'
    ];

    public function preguntas()
    {
        return $this->hasMany(Pregunta::class, 'asignaturaId');
    }   
}

