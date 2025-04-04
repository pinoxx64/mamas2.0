<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamenPregunta extends Model
{
    protected $table = 'examenpregunta';
    protected $fillable = [
        'examenId',
        'preguntaId',
    ];
    public function examen()
    {
        return $this->belongsTo(Examen::class, 'examenId');
    }
    public function pregunta()
    {
        return $this->belongsTo(Pregunta::class, 'preguntaId');
    }
}
