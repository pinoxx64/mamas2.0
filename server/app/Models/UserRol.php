<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRol extends Model
{
    protected $table = 'userrol';
    protected $fillable = [
        'usuarioId',
        'rolId'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'rolId');
    }
}