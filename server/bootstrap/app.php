<?php

use App\Http\Middleware\MidAdmin;
use App\Http\Middleware\MidAlumno;
use App\Http\Middleware\MidProfesor;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->redirectGuestsTo('api/nologin');
        $middleware->alias([
            'midProfesor' => MidProfesor::class,
            'midAdmin' => MidAdmin::class,
            'midAlumno' => MidAlumno::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
