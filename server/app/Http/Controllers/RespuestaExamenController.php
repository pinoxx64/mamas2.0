<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\RespuestaExamen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class RespuestaExamenController extends Controller
{
    public function getRespuestaExamen(){
        $respuestaExamen = RespuestaExamen::all();

        return response()->json(['respuestaExamen' => $respuestaExamen]);
    }

    public function getRespuestaExamenById($id){
        $respuestaExamen = RespuestaExamen::find($id);

        if (!$respuestaExamen) {
            return response()->json(['message' => 'Respuesta no encontrada'], 404);
        }

        return response()->json(['respuestaExamen' => $respuestaExamen]);
    }

    public function getRespuestaExamenByUsuarioIdAndExamenId($usuarioId, $examenId){
        $respuestaExamen = RespuestaExamen::where('usuarioId', $usuarioId)->where('examenId', $examenId)->get();

        if (!$respuestaExamen) {
            return response()->json(['message' => 'Respuesta no encontrada'], 404);
        }

        return response()->json(['respuestaExamen' => $respuestaExamen]);
    }

    public function postRespuestaExamen(Request $request){
        $validator = Validator::make($request->all(), [
            'examenId' => 'required|integer',
            'preguntaId' => 'required|integer',
            'usuarioId' => 'required|integer',
            'respuesta' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }else{
            $respuestaExamen = RespuestaExamen::create([
                'examenId' => $request['examenId'],
                'preguntaId' => $request['preguntaId'],
                'usuarioId' => $request['usuarioId'],
                'respuesta' => $request['respuesta']
            ]);
            return response()->json($respuestaExamen, Response::HTTP_CREATED);
        }        
    }
}
