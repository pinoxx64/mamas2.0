<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserRolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userRol = [
            [
                'usuarioId' => 1,
                'rolId' => 1
            ],
            [
                'usuarioId' => 1,
                'rolId' => 2
            ],
            [
                'usuarioId' => 2,
                'rolId' => 2
            ],
            [
                'usuarioId' => 3,
                'rolId' => 3
            ],
            [
                'usuarioId' => 4,
                'rolId' => 3
            ],
            [
                'usuarioId' => 5,
                'rolId' => 3
            ],
            [
                'usuarioId' => 6,
                'rolId' => 3
            ],
            [
                'usuarioId' => 7,
                'rolId' => 3
            ],
            [
                'usuarioId' => 8,
                'rolId' => 3
            ],
            [
                'usuarioId' => 9,
                'rolId' => 3
            ],
            [
                'usuarioId' => 10,
                'rolId' => 3
            ]
        ];

        DB::table('userrol')->insert($userRol);
    }
}
