<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Pregunta;
use Illuminate\Http\Request;

class PreguntaController extends Controller
{
    public function getPregunta(){
        $pregunta =Pregunta::all();
        return Response()->json(['pregunta' => $pregunta]);
    }

    public function getPreguntaByAsignaturaId($id){
        $pregunta = Pregunta::where('asignaturaId', $id)->get();

        if (!$pregunta) {
            return response()->json(['message' => 'user don`t find'], 404);
        }

        return response()->json(['pregunta' => $pregunta]);
    }

    public function postPregunta(Request $request){
        $pregunta = Pregunta::create([
            'tipo' => $request['tipo'],
            'pregunta' => $request['pregunta'],
            'opciones' => $request['opciones'],
            'asignaturaId' => $request['asignaturaId']
        ]);
        return response()->json(['pregunta' => $pregunta], 201);
    }

    public function putPregunta(Request $request, $id){
        $pregunta = Pregunta::find($id);

        if (!$pregunta) {
            return response()->json(['message' => 'user don`t find'], 404);
        }

        $pregunta->update([
            'tipo' => $request['tipo'],
            'pregunta' => $request['pregunta'],
            'opciones' => $request['opciones'],
            'asignaturaId' => $request['asignaturaId']
        ]);

        return response()->json(['pregunta' => $pregunta]);
    }
}
