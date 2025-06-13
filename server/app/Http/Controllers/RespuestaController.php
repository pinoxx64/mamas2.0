<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Respuesta;
use Illuminate\Http\Request;

class RespuestaController extends Controller
{
    public function getRespuesta()
    {
        $respuesta = Respuesta::all();
        return response()->json(['respuesta' => $respuesta]);
    }

    public function getRespuestaByPreguntaId($id)
    {
        $respuesta = Respuesta::where('preguntaId', $id)->get();

        if (!$respuesta) {
            return response()->json(['message' => 'respuesta no encontrada'], 404);
        }

        return response()->json(['respuesta' => $respuesta]);
    }
    
    public function postRespuesta(Request $request)
    {
        $respuesta = Respuesta::create([
            'respuesta' => $request['respuesta'],
            'preguntaId' => $request['preguntaId']
        ]);
        return response()->json(['respuesta' => $respuesta], 201);
    }

    public function putRespuesta(Request $request, $id)
    {
        $respuesta = Respuesta::find($id);

        if (!$respuesta) {
            return response()->json(['message' => 'respuesta no encontrada'], 404);
        }

        $respuesta->update([
            'respuesta' => $request['respuesta'],
            'preguntaId' => $request['preguntaId']
        ]);

        return response()->json(['respuesta' => $respuesta]);
    }
}
