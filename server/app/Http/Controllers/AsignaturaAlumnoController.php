<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AsignaturaAlumno;
use Illuminate\Http\Request;

class AsignaturaAlumnoController extends Controller
{
    public function getAsignaturaAlumno() {
        $asignaturaAlumno = AsignaturaAlumno::all();
        return response()->json(['asignaturaAlumno' => $asignaturaAlumno]);
    }

    public function getAsignaturaAlumnoById($id) {
        $asignaturaAlumno = AsignaturaAlumno::find($id);

        if (!$asignaturaAlumno) {
            return response()->json(['message' => 'AsignaturaAlumno not found'], 404);
        }

        return response()->json(['asignaturaAlumno' => $asignaturaAlumno]);
    }

    public function getAsignaturaAlumnoByUserId($userId) {
        $asignaturaAlumno = AsignaturaAlumno::where('usuarioId', $userId)->get();

        if ($asignaturaAlumno->isEmpty()) {
            return response()->json(['message' => 'AsignaturaAlumno not found'], 404);
        }

        return response()->json(['asignaturaAlumno' => $asignaturaAlumno]);
    }

    public function getAsignaturaAlumnoByAsignaturaId($asignaturaId) {
        $asignaturaAlumno = AsignaturaAlumno::where('asignaturaId', $asignaturaId)->get();

        if ($asignaturaAlumno->isEmpty()) {
            return response()->json(['message' => 'AsignaturaAlumno not found'], 404);
        }

        return response()->json(['asignaturaAlumno' => $asignaturaAlumno]);
    }

    public function postAsignaturaAlumno(Request $request) {
        $request->validate([
            'asignaturaId' => 'required|integer',
            'usuarioId' => 'required|integer',
        ]);

        $asignaturaAlumno = AsignaturaAlumno::create($request->all());

        return response()->json(['asignaturaAlumno' => $asignaturaAlumno], 201);
    }
}
