<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AsignaturaAlumno extends Model
{
    protected $table = 'asignaturaalumno';
    protected $fillable = [
        'asignaturaId',
        'usuarioId'
    ];

    public function asignatura()
    {
        return $this->belongsTo(Asignatura::class, 'asignaturaId');
    }
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuarioId');
    } 
}
