<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('asignaturaalumno', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('asignaturaId');
            $table->unsignedBigInteger('usuarioId');
            $table->timestamps();

            $table->foreign('asignaturaId')->references('id')->on('asignatura')->onDelete('cascade');
            $table->foreign('usuarioId')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asignaturaalumno');
    }
};
