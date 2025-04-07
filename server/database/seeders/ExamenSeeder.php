<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $examenes = [
            [
                'nombre' => 'Examen de prueba 1',
                'fhInicio' => '2025-04-01 10:00:00',
                'fhFinal' => '2025-04-01 12:00:00',
                'usuarioId' => 1,
                'asignaturaId' => 1,
                'active' => false
            ],
            [
                'nombre' => 'Examen de prueba 2',
                'fhInicio' => '2025-04-02 14:00:00',
                'fhFinal' => '2025-04-02 16:00:00',
                'usuarioId' => 2,
                'asignaturaId' => 2,
                'active' => false
            ]
        ];

        DB::table('examen')->insert($examenes);
    }
}
