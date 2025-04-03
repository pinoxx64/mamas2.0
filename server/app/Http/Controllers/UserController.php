<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserRol;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUser(){
        $user = User::all();
        return Response()->json(['user' => $user]);
    }

    public function getUserById($id){
        $user = user::find($id);

        if (!$user) {
            return response()->json(['message' => 'user don`t find'], 404);
        }

        return response()->json(['user' => $user]);
    }

    public function putUser(Request $request, $id){
        $user = user::find($id);

        if (!$user) {
            return response()->json(['message' => 'user no encontrado'], 404);
        }

        $datosUser = [
            'name' => $request['name'],
            'email' => $request['email'],
            'active' => $request['active'],
            'foto' => $request['foto']
        ];

        if ($request->filled('password')) {
            $datosUser['password'] = bcrypt($request['password']);
        }

        $user->update($datosUser);

        return response()->json(['user' => $user], Response::HTTP_CREATED);
    }

    public function putPassword(Request $request, $id){
        $user = user::find($id);

        if (!$user) {
            return response()->json(['message' => 'user no encontrado'], 404);
        }

        $datosUser = [
            'password' => bcrypt($request['password'])
        ];

        $user->update($datosUser);

        return response()->json(['user' => $user], Response::HTTP_CREATED);
    }

    public function getIfEmailExist($email){
        $user = user::where('email', $email)->first();

        if ($user) {
            return response(1);
        }

        return response(0);
    }

    public function getUsersWithUserRol(){
        $user = self::getUser();
        $userRol = UserRol::all();
        return response()->json(['user' => $user, 'userRol' => $userRol]);
    }
}
