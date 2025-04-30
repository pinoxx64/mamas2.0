<?php

use App\Http\Controllers\AsignaturaAlumnoController;
use App\Http\Controllers\AsignaturaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\correcionExamenController;
use App\Http\Controllers\ExamenController;
use App\Http\Controllers\ExamenPreguntaController;
use App\Http\Controllers\NotaExamenController;
use App\Http\Controllers\PreguntaController;
use App\Http\Controllers\RespuestaController;
use App\Http\Controllers\RespuestaExamenController;
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
    Route::middleware('midProfesor')->group(function() {
        Route::post('/', [PreguntaController::class, 'postPregunta']);
        Route::put('/{id}', [PreguntaController::class, 'putPregunta']);
        Route::get('/preguntaWithRespuesta', [PreguntaController::class, 'getPreguntaWithRespuesta']);
    });
});

// Respuestas
Route::prefix('respuesta')->middleware('auth:sanctum')->group(function() {
    Route::get('/', [RespuestaController::class, 'getRespuesta']);
    Route::get('/pregunta/{id}', [RespuestaController::class, 'getRespuestaByPreguntaId']);
    Route::post('/', [RespuestaController::class, 'postRespuesta'])->middleware('midProfesor');
    Route::put('/{id}', [RespuestaController::class, 'putRespuesta'])->middleware('midProfesor');
});

// Examenes
Route::prefix('examen')->middleware('auth:sanctum')->group(function() {
    Route::middleware('midProfesor')->group(function() {
        Route::get('/', [ExamenController::class, 'getExamen']);
        Route::get('/{id}', [ExamenController::class, 'getExamenById']);
        Route::get('/usuario/{id}', [ExamenController::class, 'getExamenByUsuarioId']);
        Route::post('/', [ExamenController::class, 'postExamen']);
        Route::put('/{id}', [ExamenController::class, 'putExamen']);
        Route::put('/activeOrDesable/{id}', [ExamenController::class, 'activeOrDesableExamen']);
    });
    Route::get('/{id}', [ExamenController::class, 'getExamenById']);
    Route::get('/asignatura/{id}', [ExamenController::class, 'getExamenActiveWithPreguntasByUserId']);
    Route::get('/info/{id}', [ExamenController::class, 'getExamenWithInfo']);
});

// ExamenPreguntas
Route::prefix('examenPregunta')->middleware('auth:sanctum')->group(function() {
    Route::get('/', [ExamenPreguntaController::class, 'getExamenPreguntas']);
    Route::get('/{id}', [ExamenPreguntaController::class, 'getExamenPreguntaById']);
    Route::get('/examen/{id}', [ExamenPreguntaController::class, 'getExamenPreguntaByExamenId']);
    Route::post('/', [ExamenPreguntaController::class, 'postExamenPregunta']);
    Route::delete('/{id}', [ExamenPreguntaController::class, 'deleteExamenPregunta']);
    Route::delete('/examen/{examenId}/{preguntaId}', [ExamenPreguntaController::class, 'deleteExamenPreguntaByExamenIdAndPreguntaId']);
});

// AsignaturaAlumno
Route::prefix('asignaturaAlumno')->group(function() {
    Route::middleware(['auth:sanctum', 'midAlumno'])->group(function() {
        Route::get('/', [AsignaturaAlumnoController::class, 'getAsignaturaAlumno']);
        Route::get('/{id}', [AsignaturaAlumnoController::class, 'getAsignaturaAlumnoById']);
        Route::get('/usuario/{id}', [AsignaturaAlumnoController::class, 'getAsignaturaAlumnoByUserId']);
        Route::get('/asignatura/{id}', [AsignaturaAlumnoController::class, 'getAsignaturaAlumnoByAsignaturaId']);
    });
    Route::post('/', [AsignaturaAlumnoController::class, 'postAsignaturaAlumno']);
});

// NotaExamen
Route::prefix('notaExamen')->middleware('auth:sanctum')->group(function() {
    Route::get('/', [NotaExamenController::class, 'getNotaExamen']);
    Route::get('/{id}', [NotaExamenController::class, 'getNotaExamenById']);
    Route::get('/usu/{usuarioId}', [NotaExamenController::class, 'getNotaExamenByUsuarioId']);
    Route::get('/usuario/{usuarioId}/{examenId}', [NotaExamenController::class, 'getNotaExamenByUsuarioIdAndExamenId']);
    Route::post('/', [NotaExamenController::class, 'postNotaExamen']);
    Route::put('/{id}', [NotaExamenController::class, 'putNotaExamen']);
    Route::post('/calcularNotaYGuardar', [NotaExamenController::class, 'calcularNotaYGuardar']);
    Route::post('/correguirAuto', [NotaExamenController::class, 'correguirAuto']);
    Route::post('/correguirAutoTodo', [NotaExamenController::class, 'correguirAutoTodo']);
});

// RespuestaExamen
Route::prefix('respuestaExamen')->middleware('auth:sanctum')->group(function() {
    Route::get('/', [RespuestaExamenController::class, 'getRespuestaExamen']);
    Route::get('/{id}', [RespuestaExamenController::class, 'getRespuestaExamenById']);
    Route::get('/usuario/{usuarioId}/{examenId}', [RespuestaExamenController::class, 'getRespuestaExamenByUsuarioIdAndExamenId']);
    Route::post('/', [RespuestaExamenController::class, 'postRespuestaExamen']);
    Route::get('/examen/{examenId}', [RespuestaExamenController::class, 'getRespuestaExamenWithExamenAndUserByExamenId']);
});

// CorrecionExamen
Route::prefix('correcionExamen')->middleware('auth:sanctum')->group(function() {
    Route::get('/', [correcionExamenController::class, 'getCorrecionExamen']);
    Route::get('/{id}', [correcionExamenController::class, 'getCorrecionExamenById']);
    Route::get('/respuesta/{id}', [correcionExamenController::class, 'getCorrecionExamenByRespuestaId']);
    Route::post('/', [correcionExamenController::class, 'postCorrecionExamen']);
    Route::delete('/{id}', [correcionExamenController::class, 'deleteCorrecionExamen']);
    Route::get('/usuario/{usuarioId}/{examenId}', [correcionExamenController::class, 'getCorrecionExamenByUserAndExamen']);
});

//Auth
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout']);

Route::get('/nologin', function () {
    return response()->json("No autorizado",203);
});
