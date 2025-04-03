<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Asignatura;
use Illuminate\Http\Request;

class AsignaturaController extends Controller
{
    public function getAsignatura(){
        $asignatura = Asignatura::all();
        return Response()->json(['asignatura' => $asignatura]);
    }

    public function getAsignaturaById($id){
        $asignatura = Asignatura::find($id);

        if (!$asignatura) {
            return response()->json(['message' => 'rol don`t find'], 404);
        }

        return response()->json(['asignatura' => $asignatura]);
    }
}
