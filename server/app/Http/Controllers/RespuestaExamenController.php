<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\RespuestaExamen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class RespuestaExamenController extends Controller
{
    public function getRespuestaExamen()
    {
        $respuestaExamen = RespuestaExamen::all();

        return response()->json(['respuestaExamen' => $respuestaExamen]);
    }

    public function getRespuestaExamenById($id)
    {
        $respuestaExamen = RespuestaExamen::find($id);

        if (!$respuestaExamen) {
            return response()->json(['message' => 'Respuesta no encontrada'], 404);
        }

        return response()->json(['respuestaExamen' => $respuestaExamen]);
    }

    public function getRespuestaExamenWithExamenId($examenId)
    {
        $respuestaExamen = RespuestaExamen::where('examenId', $examenId)->get();

        if (!$respuestaExamen) {
            return response()->json(['message' => 'Respuesta no encontrada'], 404);
        }

        return response()->json(['respuestaExamen' => $respuestaExamen]);
    }

    public function getRespuestaExamenByUsuarioIdAndExamenId($usuarioId, $examenId)
    {
        $respuestaExamen = RespuestaExamen::where('usuarioId', $usuarioId)->where('examenId', $examenId)->get();

        if (!$respuestaExamen) {
            return response()->json(['message' => 'Respuesta no encontrada'], 404);
        }

        return response()->json(['respuestaExamen' => $respuestaExamen]);
    }

    public function postRespuestaExamen(Request $request)
    {
        $respuestas = $request->all();
    
        if (empty($respuestas)) {
            return response()->json(['message' => 'El array de respuestas está vacío'], Response::HTTP_BAD_REQUEST);
        }

        $busqueda = RespuestaExamen::where('examenId', $respuestas[0]['examenId'])->where('usuarioId', $respuestas[0]['usuarioId']);
        if ($busqueda) {
            RespuestaExamen::where('examenId', $respuestas[0]['examenId'])->where('usuarioId', $respuestas[0]['usuarioId'])->delete();
        }

        $respuestasGuardadas = [];
        $errores = [];
    
        foreach ($respuestas as $res) {
            $validator = Validator::make($res, [
                'examenId' => 'required|integer',
                'preguntaId' => 'required|integer',
                'usuarioId' => 'required|integer',
                'respuesta' => 'required|string'
            ]);
    
            if ($validator->fails()) {
                $errores[] = [
                    'respuesta' => $res,
                    'errores' => $validator->errors()->all()
                ];
            }else{
                $respuestaExamen = RespuestaExamen::create([
                    'examenId' => $res['examenId'],
                    'preguntaId' => $res['preguntaId'],
                    'usuarioId' => $res['usuarioId'],
                    'respuesta' => $res['respuesta']
                ]);
    
                $respuestasGuardadas[] = $respuestaExamen;
            }
        }
    
        return response()->json([
            'message' => 'Todas las respuestas se guardaron correctamente',
            'respuestasGuardadas' => $respuestasGuardadas
        ], Response::HTTP_CREATED);
    }
}
