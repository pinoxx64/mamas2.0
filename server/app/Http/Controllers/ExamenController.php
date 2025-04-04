<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Examen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ExamenController extends Controller
{
    public function getExamen(){
        $examen = Examen::all();
        return Response()->json(['examen' => $examen]);
    }

    public function getExamenById($id){
        $examen = Examen::find($id);

        if (!$examen) {
            return response()->json(['message' => 'examen don`t find'], 404);
        }

        return response()->json(['examen' => $examen]);
    }

    public function getExamenByUsuarioId($id){
        $examen = Examen::where('usuarioId', $id)->get();

        if (!$examen) {
            return response()->json(['message' => 'examen don`t find'], 404);
        }

        return response()->json(['examen' => $examen]);
    }

    public function postExamen(Request $request){
        $$validator= Validator::make($request->all(), [
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
}
