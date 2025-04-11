<?php

namespace App\Http\Controllers;

use App\Models\UserRol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class UserRolController extends Controller
{
    public function getUserRol(){
        $userRol = UserRol::all();
        return Response()->json(['user' => $userRol]);
    }

    public function getUserRolByusuarioId($id){
        $userRol = userRol::where('usuarioId', $id)->get();

        if (!$userRol) {
            return response()->json(['message' => 'user don`t find'], 404);
        }

        return response()->json(['user' => $userRol]);
    }

    public function getUserRolByRolId($id){
        $userRol = userRol::where('rolId', $id)->get();

        if (!$userRol) {
            return response()->json(['message' => 'userRol don`t find'], 404);
        }

        return response()->json(['user' => $userRol]);
    }

    public function postUserRol(Request $request){
        $validator = Validator::make($request->all(), [
            'usuarioId' => 'required|integer',
            'rolId' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }else{
            $userRol = UserRol::create([
                'usuarioId' => $request['usuarioId'],
                'rolId' => $request['rolId']
            ]);
            return response()->json(['user' => $userRol], Response::HTTP_CREATED);
        }
    }

    public function deleteUserRolByIds($usuarioId, $rolId)
    {
        $userRol = UserRol::where('usuarioId', $usuarioId)->where('rolId', $rolId);

        if ($userRol) {
            $userRol->delete();
            return response()->json(['message' => 'Registro eliminado correctamente'], 200);
        } else {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }
    }
}
