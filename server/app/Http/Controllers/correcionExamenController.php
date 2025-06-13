<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CorrecionExamen;
use App\Models\ExamenPregunta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class correcionExamenController extends Controller
{
    public function getCorrecionExamen()
    {
        $correcionExamen = ExamenPregunta::all();
        return response()->json(['correcionExamen' => $correcionExamen]);
    }

    public function getCorrecionExamenById($id)
    {
        $correcionExamen = ExamenPregunta::find($id);

        if (!$correcionExamen) {
            return response()->json(['message' => 'correcionExamen don`t find'], 404);
        }

        return response()->json(['correcionExamen' => $correcionExamen]);
    }

    public function getCorrecionExamenByRespuestaId($id)
    {
        $correcionExamen = ExamenPregunta::where('respuestaId', $id)->get();

        if (!$correcionExamen) {
            return response()->json(['message' => 'correcionExamen don`t find'], 404);
        }

        return response()->json(['correcionExamen' => $correcionExamen]);
    }

    public function postCorrecionExamen(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'correcciones' => 'required|array',
            'correcciones.*.respuestaId' => 'required|integer|exists:respuesta_examen,id',
            'correcciones.*.correcta' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $correcciones = $request->input('correcciones');
        $createdCorrecciones = [];

        foreach ($correcciones as $correccion) {
            $existingCorrecion = CorrecionExamen::where('respuestaId', $correccion['respuestaId'])->first();

            if ($existingCorrecion) {
                $existingCorrecion->delete();
            }

            $createdCorrecciones[] = CorrecionExamen::create([
                'respuestaId' => $correccion['respuestaId'],
                'correcta' => $correccion['correcta'],
            ]);
        }

        return response()->json([
            'message' => 'Correcciones creadas con éxito',
            'correcciones' => $createdCorrecciones,
        ], 201);
    }

    public function deleteCorrecionExamen($id)
    {
        $correcionExamen = ExamenPregunta::find($id);

        if (!$correcionExamen) {
            return response()->json(['message' => 'correcionExamen don`t find'], 404);
        }

        $correcionExamen->delete();
        return response()->json(['message' => 'correcionExamen deleted successfully'], 200);
    }

    public function getCorrecionExamenByUserAndExamen($usuarioId, $examenId)
    {
        $correcciones = CorrecionExamen::whereHas('respuesta', function ($query) use ($usuarioId, $examenId) {
            $query->where('usuarioId', $usuarioId)
                ->where('examenId', $examenId);
        })->with('respuesta.pregunta')
            ->get();

        if ($correcciones->isEmpty()) {
            return response()->json(['message' => 'No se encontraron correcciones para este usuario y examen.'], 404);
        }

        return response()->json(['correcciones' => $correcciones], 200);
    }
}
