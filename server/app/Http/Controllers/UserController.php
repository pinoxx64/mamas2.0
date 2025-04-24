<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserRol;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUser()
    {
        $user = User::all();
        return Response()->json(['user' => $user]);
    }

    public function getUserById($id)
    {
        $user = user::find($id);

        if (!$user) {
            return response()->json(['message' => 'user don`t find'], 404);
        }

        return response()->json(['user' => $user]);
    }

    public function putUser(Request $request, $id)
    {
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

    public function putPassword(Request $request, $id)
    {
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

    public function updateUserPhoto(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'foto' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        try {
            if ($user->foto) {
                $publicId = pathinfo($user->foto, PATHINFO_FILENAME);
                Cloudinary::destroy($publicId);
            }

            $uploadedFileUrl = Cloudinary::upload($request->file('foto')->getRealPath(), [
                'folder' => 'mamas',
            ])->getSecurePath();

            $user->update(['foto' => $uploadedFileUrl]);

            return response()->json([
                'message' => 'Foto actualizada correctamente',
                'foto' => $uploadedFileUrl,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la foto',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getIfEmailExist($email)
    {
        $user = user::where('email', $email)->first();

        if ($user) {
            return response(1);
        }

        return response(0);
    }

    public function getUsersWithUserRol()
    {
        $user = self::getUser();
        $userRol = UserRol::all();
        return response()->json(['user' => $user, 'userRol' => $userRol]);
    }
}
