<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $fillable = [
        'nombre'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'userRol', 'rolId', 'usuarioId');
    }
}
