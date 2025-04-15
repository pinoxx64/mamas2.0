<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NotasExamen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class NotaExamenController extends Controller
{
    public function getNotaExamen(){
        $notasExamen = NotasExamen::all();

        return response()->json(['notasExamen' => $notasExamen]);
    }

    public function getNotaExamenById($id){
        $notasExamen = NotasExamen::find($id);

        if (!$notasExamen) {
            return response()->json(['message' => 'Nota no encontrada'], 404);
        }

        return response()->json(['notasExamen' => $notasExamen]);
    }

    public function getNotaExamenByUsuarioIdAndExamenId($usuarioId, $examenId){
        $notasExamen = NotasExamen::where('usuarioId', $usuarioId)->where('examenId', $examenId)->get();

        if (!$notasExamen) {
            return response()->json(['message' => 'Nota no encontrada'], 404);
        }

        return response()->json(['notasExamen' => $notasExamen]);
    }

    public function postNotaExamen(Request $request){
        $validator = Validator::make($request->all(), [
            'examenId' => 'required|integer',
            'usuarioId' => 'required|integer',
            'nota' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }else{
            $notasExamen = NotasExamen::create([
                'examenId' => $request['examenId'],
                'usuarioId' => $request['usuarioId'],
                'nota' => $request['nota']
            ]);
            return response()->json($notasExamen, Response::HTTP_CREATED);
        }
    }

    public function putNotaExamen(Request $request, $id){
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
}
