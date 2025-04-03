<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PreguntaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $preguntas = [
            [
                'tipo' => 'numero',
                'pregunta' => '¿Cuantos megas tiene un giga?',
                'opciones' => null,
                'asignaturaId' => 1
            ],
            [
                'tipo' => 'texto',
                'pregunta' => 'Escribe algo',
                'opciones' => null,
                'asignaturaId' => 2
            ],
            [
                'tipo' => 'opciones individuales',
                'pregunta' => 'Escoja una de las siguientes',
                'opciones' => 'a \n b \n c \n d',
                'asignaturaId' => 1
            ],
            [
                'tipo' => 'opciones multiples',
                'pregunta' => 'Escoja dos de las siguientes',
                'opciones' => 'a \n b \n c \n d',
                'asignaturaId' => 2
            ]            
        ];

        DB::table('pregunta')->insert($preguntas);
    }
}
