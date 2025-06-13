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
        Schema::create('respuesta_examen', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('examenId');
            $table->unsignedBigInteger('preguntaId');
            $table->unsignedBigInteger('usuarioId');
            $table->string('respuesta');
            $table->timestamps();

            $table->foreign('examenId')->references('id')->on('examen')->onDelete('cascade');
            $table->foreign('preguntaId')->references('id')->on('pregunta')->onDelete('cascade');
            $table->foreign('usuarioId')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respuesta_examen');
    }
};
