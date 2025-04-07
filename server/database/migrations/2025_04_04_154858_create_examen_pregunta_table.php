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
        Schema::create('examen_pregunta', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('examenId');
            $table->unsignedBigInteger('preguntaId');
            $table->timestamps();

            $table->foreign('examenId')->references('id')->on('examen')->onDelete('cascade');
            $table->foreign('preguntaId')->references('id')->on('pregunta')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examen_pregunta');
    }
};
