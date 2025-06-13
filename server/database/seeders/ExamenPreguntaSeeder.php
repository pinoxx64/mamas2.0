<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamenPreguntaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $examenPreguntas = [
            [
                'examenId' => 1,
                'preguntaId' => 1,
                'puntuacion' => 1
            ],
            [
                'examenId' => 1,
                'preguntaId' => 2,
                'puntuacion' => 1
            ],
            [
                'examenId' => 2,
                'preguntaId' => 3,
                'puntuacion' => 1
            ],
            [
                'examenId' => 2,
                'preguntaId' => 4,
                'puntuacion' => 1
            ]
        ];

        DB::table('examen_pregunta')->insert($examenPreguntas);
    }
}
