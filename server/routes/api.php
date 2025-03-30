<?php

use App\Http\Controllers\AsignaturaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PreguntaController;
use App\Http\Controllers\RespuestaController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRolController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


//Usuarios
Route::prefix('user')->middleware('auth:sanctum')->group(function() {
    Route::get('/{id}', [UserController::class, 'getUserById']);
    Route::put('/password/{id}', [UserController::class, 'putPassword']);
    Route::middleware('midAdmin')->group(function() {
        Route::get('/', [UserController::class, 'getUser']);
        Route::put('/{id}', [UserController::class, 'putUser']);
        Route::get('/userWithRol/more/info', [UserController::class, 'getUsersWithUserRol']);
    });
});
Route::get('user/ifMailExist/{email}', [UserController::class, 'getIfEmailExist']);

// Roles
Route::prefix('rol')->middleware(['auth:sanctum', 'midAdmin'])->group(function() {
    Route::get('/', [RolController::class, 'getRol']);
    Route::get('/{id}', [RolController::class, 'getRolById']);
});


// UsuarioRol
Route::prefix('userRol')->middleware('auth:sanctum')->group(function() {
    Route::middleware('midAdmin')->group(function() {
        Route::get('/', [UserRolController::class, 'getUserRol']);
        Route::get('/rol/{id}', [UserRolController::class, 'getUserRolByRolId']);
        Route::post('/', [UserRolController::class, 'postUserRol']);
        Route::delete('/{usuarioId}/{rolId}', [UserRolController::class, 'deleteUserRolByIds']);
    });
    Route::get('/usuario/{id}', [UserRolController::class, 'getUserRolByusuarioId']);

});

// Asignaturas (de momento no depende de rol )
Route::prefix('asignatura')->middleware('auth:sanctum')->group(function() {
    Route::get('/', [AsignaturaController::class, 'getAsignatura']);
    Route::get('/{id}' , [AsignaturaController::class, 'getAsignaturaById']);
});

// Preguntas
Route::prefix('pregunta')->middleware('auth:sanctum')->group(function() {
    Route::get('/', [PreguntaController::class, 'getPregunta']);
    Route::get('/asignatura/{id}', [PreguntaController::class, 'getPreguntaByAsignaturaId']);
    Route::post('/', [PreguntaController::class, 'postPregunta'])->middleware('midProfesor');
});

// Respuestas
Route::prefix('respuesta')->middleware('auth:sanctum')->group(function() {
    Route::get('/', [RespuestaController::class, 'getRespuesta']);
    Route::get('/pregunta/{id}', [RespuestaController::class, 'getRespuestaByPreguntaId']);
    Route::post('/', [RespuestaController::class, 'postRespuesta'])->middleware('midProfesor');
});
//Auth
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout']);

Route::get('/nologin', function () {
    return response()->json("No autorizado",203);
});
