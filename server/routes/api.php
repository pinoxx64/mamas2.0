<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRolController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('user')->middleware('auth:sanctum')->group(function() {
    Route::get('/', [UserController::class, 'getUser']);
    Route::get('/{id}', [UserController::class, 'getUserById']);
    Route::put('/{id}', [UserController::class, 'putUser']);
    Route::get('/userWithRol/more/info', [UserController::class, 'getUsersWithUserRol']);
});

Route::get('user/ifMailExist/{email}', [UserController::class, 'getIfEmailExist']);

Route::prefix('rol')->group(function() {
    Route::get('/', [RolController::class, 'getRol']);
    Route::get('/{id}', [RolController::class, 'getRolById']);
});

Route::prefix('userRol')->middleware(['auth:sanctum', 'midAdmin'])->group(function() {
    Route::get('/', [UserRolController::class, 'getUserRol']);
    Route::get('/usuario/{id}', [UserRolController::class, 'getUserRolByusuarioId']);
    Route::get('/rol/{id}', [UserRolController::class, 'getUserRolByRolId']);
    Route::post('/', [UserRolController::class, 'postUserRol']);
    Route::delete('/{usuarioId}/{rolId}', [UserRolController::class, 'deleteUserRolByIds']);
});

//Auth
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout']);

Route::get('/nologin', function () {
    return response()->json("No autorizado",203);
});
