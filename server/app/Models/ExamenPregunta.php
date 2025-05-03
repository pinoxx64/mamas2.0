<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamenPregunta extends Model
{
    protected $table = 'examen_pregunta';
    protected $fillable = [
        'examenId',
        'preguntaId',
        'puntuacion'
    ];
    public function examen()
    {
        return $this->belongsTo(Examen::class, 'examenId');
    }
    public function pregunta()
    {
        return $this->belongsTo(Pregunta::class, 'preguntaId');
    }
    public function respuestas()
    {
    return $this->hasManyThrough(Respuesta::class,Pregunta::class,'id','preguntaId','preguntaId', 'id');
}
}
