<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ExamenPregunta;
use App\Models\NotasExamen;
use App\Models\Pregunta;
use App\Models\RespuestaExamen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class NotaExamenController extends Controller
{
    public function getNotaExamen()
    {
        $notasExamen = NotasExamen::all();

        return response()->json(['notasExamen' => $notasExamen]);
    }

    public function getNotaExamenById($id)
    {
        $notasExamen = NotasExamen::find($id);

        if (!$notasExamen) {
            return response()->json(['message' => 'Nota no encontrada'], 404);
        }

        return response()->json(['notasExamen' => $notasExamen]);
    }

    public function getNotaExamenByUsuarioIdAndExamenId($usuarioId, $examenId)
    {
        $notasExamen = NotasExamen::where('usuarioId', $usuarioId)->where('examenId', $examenId)->get();

        if (!$notasExamen) {
            return response()->json(['message' => 'Nota no encontrada'], 404);
        }

        return response()->json(['notasExamen' => $notasExamen]);
    }

    public function getNotaExamenByUsuarioId($usuarioId)
    {
        $notasExamen = NotasExamen::where('usuarioId', $usuarioId)
            ->with('examen')
            ->get();

        if (!$notasExamen) {
            return response()->json(['message' => 'Nota no encontrada'], 404);
        }

        return response()->json(['notasExamen' => $notasExamen]);
    }

    public function postNotaExamen(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'examenId' => 'required|integer',
            'usuarioId' => 'required|integer',
            'nota' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } else {
            $notasExamen = NotasExamen::create([
                'examenId' => $request['examenId'],
                'usuarioId' => $request['usuarioId'],
                'nota' => $request['nota']
            ]);
            return response()->json($notasExamen, Response::HTTP_CREATED);
        }
    }

    public function putNotaExamen(Request $request, $id)
    {
        $notaExamen = NotasExamen::find($id);

        if (!$notaExamen) {
            return response()->json(['message' => 'Nota no encontrada'], 404);
        }

        $datos = $request->validate([
            'examenId' => 'required|integer',
            'usuarioId' => 'required|integer',
            'nota' => 'required|numeric'
        ]);

        $notaExamen->update($datos);

        return response()->json(['message' => $notaExamen], Response::HTTP_CREATED);
    }

    public function calcularNotaYGuardar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'examenId' => 'required|integer',
            'usuarioId' => 'required|integer',
            'resultados' => 'required|array',
            'resultados.*.respuestaId' => 'required|integer',
            'resultados.*.correcta' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $examenId = $request->input('examenId');
        $usuarioId = $request->input('usuarioId');
        $resultados = $request->input('resultados');

        $preguntas = ExamenPregunta::where('examenId', $examenId)
            ->with('pregunta')
            ->get();

        if ($preguntas->isEmpty()) {
            return response()->json(['message' => 'No se encontraron preguntas para este examen'], 404);
        }

        $notaTotal = 0;
        $puntuacionMaxima = $preguntas->sum('puntuacion');

        foreach ($resultados as $resultado) {
            $respuestaExamen = RespuestaExamen::find($resultado['respuestaId']);

            if ($respuestaExamen && $resultado['correcta']) {
                $pregunta = $preguntas->firstWhere('preguntaId', $respuestaExamen->preguntaId);
                if ($pregunta) {
                    $notaTotal += $pregunta->puntuacion;
                }
            }
        }

        $notaFinal = $puntuacionMaxima > 0 ? ($notaTotal / $puntuacionMaxima) * 10 : 0;

        $notaExamen = NotasExamen::updateOrCreate(
            ['examenId' => $examenId, 'usuarioId' => $usuarioId],
            ['nota' => $notaFinal]
        );

        return response()->json([
            'message' => 'Nota calculada y guardada correctamente',
            'notaExamen' => $notaExamen,
        ], Response::HTTP_CREATED);
    }

    public function correguirAuto(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'examenId' => 'required|integer',
            'usuarioId' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $examenId = $request->input('examenId');
        $usuarioId = $request->input('usuarioId');

        $this->deleteNotaExamenExistente($examenId, $usuarioId);

        $respuestasUsuario = RespuestaExamen::where('examenId', $examenId)
            ->where('usuarioId', $usuarioId)
            ->get();

        if ($respuestasUsuario->isEmpty()) {
            return response()->json(['message' => 'No se encontraron respuestas para este usuario en este examen'], 404);
        }

        $preguntas = ExamenPregunta::where('examenId', $examenId)
            ->with(['pregunta.respuestas'])
            ->get();

        $nota = 0;
        $correcciones = [];

        foreach ($respuestasUsuario as $respuestaUsuario) {
            $pregunta = $preguntas->firstWhere('preguntaId', $respuestaUsuario->preguntaId);
            $correcta = false;

            if ($pregunta) {
                $respuestasCorrectas = $pregunta->pregunta->respuestas->pluck('respuesta')->map(function ($respuesta) {
                    return trim(strtolower($respuesta));
                })->toArray();

                $respuestasUsuario = array_map('trim', explode(',', strtolower($respuestaUsuario->respuesta)));

                if (!array_diff($respuestasUsuario, $respuestasCorrectas)) {
                    $nota += $pregunta->puntuacion;
                    $correcta = true;
                }

                $correcciones[] = [
                    'respuestaId' => $respuestaUsuario->id,
                    'correcta' => $correcta,
                ];
            }
        }

        $correcionController = new correcionExamenController();
        $correcionController->postCorrecionExamen(new Request([
            'correcciones' => $correcciones,
        ]));

        $notaExamen = NotasExamen::updateOrCreate(
            ['examenId' => $examenId, 'usuarioId' => $usuarioId],
            ['nota' => $nota]
        );

        return response()->json([
            'message' => 'Corrección automática realizada correctamente',
            'nota' => $nota,
            'correcciones' => $correcciones
        ], Response::HTTP_OK);
    }

    public function correguirAutoTodo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'examenId' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $examenId = $request->input('examenId');

        $usuarios = RespuestaExamen::where('examenId', $examenId)
            ->select('usuarioId')
            ->distinct()
            ->get();

        if ($usuarios->isEmpty()) {
            return response()->json(['message' => 'No se encontraron usuarios que hayan contestado este examen'], 404);
        }

        $preguntas = ExamenPregunta::where('examenId', $examenId)
            ->with(['pregunta.respuestas'])
            ->get();

        $notasGuardadas = [];
        $correcionController = new correcionExamenController();

        foreach ($usuarios as $usuario) {
            $usuarioId = $usuario->usuarioId;

            $this->deleteNotaExamenExistente($examenId, $usuarioId);

            $respuestasUsuario = RespuestaExamen::where('examenId', $examenId)
                ->where('usuarioId', $usuarioId)
                ->get();

            $nota = 0;
            $correcciones = [];

            foreach ($respuestasUsuario as $respuestaUsuario) {
                $pregunta = $preguntas->firstWhere('preguntaId', $respuestaUsuario->preguntaId);
                $correcta = false;

                if ($pregunta) {
                    $respuestasCorrectas = $pregunta->pregunta->respuestas->map(function ($respuesta) {
                        return trim(strtolower($respuesta->respuesta));
                    })->toArray();

                    $respuestasUsuario = array_map('trim', explode(',', strtolower($respuestaUsuario->respuesta)));

                    if (!array_diff($respuestasUsuario, $respuestasCorrectas)) {
                        $nota += $pregunta->puntuacion;
                        $correcta = true;
                    }

                    $correcciones[] = [
                        'respuestaId' => $respuestaUsuario->id,
                        'correcta' => $correcta,
                    ];
                }
            }

            $correcionController->postCorrecionExamen(new Request([
                'correcciones' => $correcciones,
            ]));

            $notaExamen = NotasExamen::updateOrCreate(
                ['examenId' => $examenId, 'usuarioId' => $usuarioId],
                ['nota' => $nota]
            );

            $notasGuardadas[] = $notaExamen;
        }

        return response()->json([
            'message' => 'Corrección automática realizada para todos los usuarios',
            'notasExamen' => $notasGuardadas,
        ], Response::HTTP_OK);
    }

    public function deleteNotaExamenExistente($examenId, $usuarioId)
    {
        NotasExamen::where('examenId', $examenId)->where('usuarioId', $usuarioId)->delete();
    }
}
