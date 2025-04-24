<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotasExamen extends Model
{
    protected $table = 'nota_examen';
    protected $fillable = [
        'examenId',
        'usuarioId',
        'nota',
    ];

    public function examen()
    {
        return $this->belongsTo(Examen::class, 'examenId');
    }
}
