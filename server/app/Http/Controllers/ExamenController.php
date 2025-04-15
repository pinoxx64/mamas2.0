<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AsignaturaAlumno;
use App\Models\Examen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ExamenController extends Controller
{
    public function getExamen(){
        $examenes = Examen::with(['preguntas.respuestas', 'asignatura'])->get();

        return response()->json(['examenes' => $examenes]);
    }

    public function getExamenById($id){
        $examen = Examen::with(['preguntas.respuestas'])->find($id);

        if (!$examen) {
            return response()->json(['message' => 'Examen no encontrado'], 404);
        }
    
        return response()->json(['examen' => $examen], Response::HTTP_OK);
    }

    public function getExamenByUsuarioId($id){
        $examen = Examen::where('usuarioId', $id)->get();

        if (!$examen) {
            return response()->json(['message' => 'examen don`t find'], 404);
        }

        return response()->json(['examen' => $examen]);
    }

    public function postExamen(Request $request){
        $validator= Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'fhInicio' => 'required|date',
            'fhFinal' => 'required|date',
            'usuarioId' => 'required|integer',
            'asignaturaId' => 'required|integer',
            'active' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }else{
            $examen = Examen::create([
                'nombre' => $request['nombre'],
                'fhInicio' => $request['fhInicio'],
                'fhFinal' => $request['fhFinal'],
                'usuarioId' => $request['usuarioId'],
                'asignaturaId' => $request['asignaturaId'],
                'active' => $request['active']
            ]);
            return response()->json(['examen' => $examen], 201);
        }
    }

    public function putExamen(Request $request, $id){
        $examen = Examen::find($id);

        if (!$examen) {
            return response()->json(['message' => 'examen no encontrado'], 404);
        }

        $datosExamen = [
            'nombre' => $request['nombre'],
            'fhInicio' => $request['fhInicio'],
            'fhFinal' => $request['fhFinal'],
            'usuarioId' => $request['usuarioId'],
            'asignaturaId' => $request['asignaturaId'],
            'active' => $request['active']
        ];

        $examen->update($datosExamen);

        return response()->json(['examen' => $examen], Response::HTTP_CREATED);
    }

    public function activeOrDesableExamen($id){
        $examen = Examen::find($id);

        if (!$examen) {
            return response()->json(['message' => 'examen no encontrado'], 404);
        }

        if ($examen->active) {
            $examen->active = 0;
        } else {
            $examen->active = 1;
        }
        $examen->save();

        return response()->json(['examen' => $examen], Response::HTTP_OK);
    }

    public function getExamenActiveWithPreguntasByUserId($id){
        $asignaturasUsuario = AsignaturaAlumno::where('usuarioId', $id)->pluck('asignaturaId');

        if ($asignaturasUsuario->isEmpty()) {
            return response()->json(['message' => 'El usuario no tiene asignaturas asociadas'], 404);
        }
    
        $examenes = Examen::whereIn('asignaturaId', $asignaturasUsuario)
            ->where('active', 1)
            ->with(['preguntas.respuestas', 'asignatura'])
            ->get();
    
        if ($examenes->isEmpty()) {
            return response()->json(['message' => 'No se encontraron exámenes activos para las asignaturas del usuario'], 404);
        }
    
        return response()->json(['examenes' => $examenes], Response::HTTP_OK);
    }
}
