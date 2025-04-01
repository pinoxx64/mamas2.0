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

    public function getPreguntaWithRespuesta()
    {
        $preguntas = Pregunta::with(['respuestas', 'asignatura'])->get();

        $preguntasWithAll = $preguntas->map(function ($pregunta) {
            return [
                'id' => $pregunta->id,
                'tipo' => $pregunta->tipo,
                'pregunta' => $pregunta->pregunta,
                'opciones' => $pregunta->opciones,
                'asignatura' => $pregunta->asignatura ? $pregunta->asignatura->nombre : null,
                'respuestas' => $pregunta->respuestas,
                'created_at' => $pregunta->created_at,
                'updated_at' => $pregunta->updated_at,
            ];
        });
    
        return response()->json(['preguntas' => $preguntasWithAll]);
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
