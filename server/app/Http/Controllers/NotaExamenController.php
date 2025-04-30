<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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
            'resultados.*.puntuacion' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $examenId = $request->input('examenId');
        $usuarioId = $request->input('usuarioId');
        $resultados = $request->input('resultados');

        $this->deleteNotaExamenExistente($examenId, $usuarioId);

        $notaTotal = 0;
        $puntuacionMaxima = 0;

        foreach ($resultados as $resultado) {
            $puntuacion = $resultado['puntuacion'];
            $puntuacionMaxima += $puntuacion;

            if ($resultado['correcta']) {
                $notaTotal += $puntuacion;
            }
        }
        $notaFinal = $puntuacionMaxima > 0 ? ($notaTotal / $puntuacionMaxima) * 10 : 0;

        $notaExamen = NotasExamen::create([
            'examenId' => $examenId,
            'usuarioId' => $usuarioId,
            'nota' => $notaFinal,
        ]);

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

        $preguntas = Pregunta::whereHas('examen', function ($query) use ($examenId) {
            $query->where('examenId', $examenId);
        })->with(['respuestas', 'examenPregunta' => function ($query) use ($examenId) {
            $query->where('examenId', $examenId);
        }])->get();

        if ($preguntas->isEmpty()) {
            return response()->json(['message' => 'No se encontraron preguntas para este examen'], 404);
        }

        $nota = 0;

        foreach ($respuestasUsuario as $respuestaUsuario) {
            $pregunta = $preguntas->firstWhere('id', $respuestaUsuario->preguntaId);

            if ($pregunta) {
                $respuestaCorrecta = $pregunta->respuestas->first();
                $puntuacion = $pregunta->examenPregunta->puntuacion;

                if ($pregunta->tipo === 'numero' || $pregunta->tipo === 'texto') {
                    if ($respuestaCorrecta && trim(strtolower($respuestaCorrecta->respuesta)) === trim(strtolower($respuestaUsuario->respuesta))) {
                        $nota += $puntuacion;
                    }
                } elseif ($pregunta->tipo === 'opciones individuales') {
                    if ($respuestaCorrecta && trim(strtolower($respuestaCorrecta->respuesta)) === trim(strtolower($respuestaUsuario->respuesta))) {
                        $nota += $puntuacion;
                    }
                } elseif ($pregunta->tipo === 'opciones multiples') {
                    $respuestasCorrectas = explode(',', str_replace(' ', '', strtolower($respuestaCorrecta->respuesta)));
                    $respuestasUsuario = explode(',', str_replace(' ', '', strtolower($respuestaUsuario->respuesta)));

                    if (!array_diff($respuestasCorrectas, $respuestasUsuario)) {
                        $nota += $puntuacion;
                    }
                }
            }
        }

        NotasExamen::updateOrCreate(
            ['examenId' => $examenId, 'usuarioId' => $usuarioId],
            ['nota' => $nota]
        );

        return response()->json([
            'message' => 'Corrección automática realizada correctamente',
            'nota' => $nota,
            'pregunta' => $preguntas
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

        $preguntas = Pregunta::whereHas('examen', function ($query) use ($examenId) {
            $query->where('examenId', $examenId);
        })->with(['respuestas', 'examenPregunta' => function ($query) use ($examenId) {
            $query->where('examenId', $examenId);
        }])->get();

        if ($preguntas->isEmpty()) {
            return response()->json(['message' => 'No se encontraron preguntas para este examen'], 404);
        }

        $notasGuardadas = [];

        foreach ($usuarios as $usuario) {
            $usuarioId = $usuario->usuarioId;

            $this->deleteNotaExamenExistente($examenId, $usuarioId);

            $respuestasUsuario = RespuestaExamen::where('examenId', $examenId)
                ->where('usuarioId', $usuarioId)
                ->get();

            $nota = 0;

            foreach ($respuestasUsuario as $respuestaUsuario) {
                $pregunta = $preguntas->firstWhere('id', $respuestaUsuario->preguntaId);

                if ($pregunta) {
                    $respuestaCorrecta = $pregunta->respuestas->first();
                    $puntuacion = $pregunta->examenPregunta->puntuacion;

                    if ($pregunta->tipo === 'numero' || $pregunta->tipo === 'texto') {
                        if ($respuestaCorrecta && trim(strtolower($respuestaCorrecta->respuesta)) === trim(strtolower($respuestaUsuario->respuesta))) {
                            $nota += $puntuacion;
                        }
                    } elseif ($pregunta->tipo === 'opciones individuales') {
                        if ($respuestaCorrecta && trim(strtolower($respuestaCorrecta->respuesta)) === trim(strtolower($respuestaUsuario->respuesta))) {
                            $nota += $puntuacion;
                        }
                    } elseif ($pregunta->tipo === 'opciones multiples') {
                        $respuestasCorrectas = explode(',', str_replace(' ', '', strtolower($respuestaCorrecta->respuesta)));
                        $respuestasUsuario = explode(',', str_replace(' ', '', strtolower($respuestaUsuario->respuesta)));

                        if (!array_diff($respuestasCorrectas, $respuestasUsuario)) {
                            $nota += $puntuacion;
                        }
                    }
                }
            }

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
