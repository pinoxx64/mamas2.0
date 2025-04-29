<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ExamenPregunta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ExamenPreguntaController extends Controller
{
    public function getExamenPreguntas(){
        $examenPreguntas = ExamenPregunta::all();
        return response()->json(['examenPreguntas' => $examenPreguntas]);
    }

    public function getExamenPreguntaById($id){
        $examenPregunta = ExamenPregunta::find($id);

        if (!$examenPregunta) {
            return response()->json(['message' => 'examenPregunta don`t find'], 404);
        }

        return response()->json(['examenPregunta' => $examenPregunta]);
    }

    public function getExamenPreguntaByExamenId($id){
        $examenPregunta = ExamenPregunta::where('examenId', $id)->get();

        if (!$examenPregunta) {
            return response()->json(['message' => 'examenPregunta don`t find'], 404);
        }

        return response()->json(['examenPregunta' => $examenPregunta]);
    }

    public function postExamenPregunta(Request $request){
        $validator = Validator::make($request->all(), [
            'examenId' => 'required|integer',
            'preguntaId' => 'required|integer',
            'puntuacion' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }else{
            $examenPregunta = ExamenPregunta::create([
                'examenId' => $request['examenId'],
                'preguntaId' => $request['preguntaId'],
                'puntuacion' => $request['puntuacion'],
            ]);
            return response()->json(['examenPregunta' => $examenPregunta], 201);
        }
    }

    public function deleteExamenPregunta($id){
        $examenPregunta = ExamenPregunta::find($id);

        if (!$examenPregunta) {
            return response()->json(['message' => 'examenPregunta don`t find'], 404);
        }

        $examenPregunta->delete();
        return response()->json(['message' => 'Registro eliminado correctamente'], 200);
    }

    public function deleteExamenPreguntaByExamenIdAndPreguntaId($examenId, $preguntaId){
        $examenPregunta = ExamenPregunta::where('examenId', $examenId)->where('preguntaId', $preguntaId)->first();

        if (!$examenPregunta) {
            return response()->json(['message' => 'examenPregunta don`t find'], 404);
        }

        $examenPregunta->delete();
        return response()->json(['message' => 'Registro eliminado correctamente'], 200);
    }
}
