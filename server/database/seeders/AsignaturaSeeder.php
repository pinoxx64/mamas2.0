<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AsignaturaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $asignaturas = [
            [
                'nombre' => 'DWC'
            ],
            [
                'nombre' => 'DWC'
            ]
        ];

        DB::table('asignatura')->insert($asignaturas);
    }
}
