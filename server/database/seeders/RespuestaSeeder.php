<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RespuestaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $respuestas = [
            [
                'respuesta' => '1000',
                'preguntaId' => 1
            ],
            [
                'respuesta' => 'algo',
                'preguntaId' => 2
            ],
            [
                'respuesta' => 'a',
                'preguntaId' => 3
            ],
            [
                'respuesta' => 'a',
                'preguntaId' => 4
            ],
            [
                'respuesta' => 'b',
                'preguntaId' => 4
            ]
        ];

        DB::table('respuesta')->insert($respuestas);
    }
}
