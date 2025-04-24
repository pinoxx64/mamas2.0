<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class asignaturaAlumnoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $asignaturaAlumno = [
            [
                'asignaturaId' => 1,
                'usuarioId' => 3
            ],
            [
                'asignaturaId' => 2,
                'usuarioId' => 3
            ],
            [
                'asignaturaId' => 1,
                'usuarioId' => 4
            ],
            [
                'asignaturaId' => 2,
                'usuarioId' => 4
            ],
            [
                'asignaturaId' => 1,
                'usuarioId' => 5
            ],
            [
                'asignaturaId' => 2,
                'usuarioId' => 5
            ],            
            [
                'asignaturaId' => 1,
                'usuarioId' => 6
            ],
            [
                'asignaturaId' => 2,
                'usuarioId' => 6
            ],
            [
                'asignaturaId' => 1,
                'usuarioId' => 7
            ],
            [
                'asignaturaId' => 2,
                'usuarioId' => 7
            ],
            [
                'asignaturaId' => 1,
                'usuarioId' => 8
            ],
            [
                'asignaturaId' => 2,
                'usuarioId' => 8
            ],
            [
                'asignaturaId' => 1,
                'usuarioId' => 9
            ],
            [
                'asignaturaId' => 2,
                'usuarioId' => 9
            ],
            [
                'asignaturaId' => 1,
                'usuarioId' => 10
            ],
            [
                'asignaturaId' => 2,
                'usuarioId' => 10
            ],
        ];
        DB::table('asignaturaalumno')->insert($asignaturaAlumno);
    }
}
