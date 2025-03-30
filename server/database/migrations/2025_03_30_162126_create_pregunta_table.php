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
        Schema::create('pregunta', function (Blueprint $table) {
            $table->id();
            $table->string('tipo');
            $table->string('pregunta');
            $table->string('opciones')->nullable();
            $table->unsignedBigInteger('asignaturaId');
            $table->timestamps();

            $table->foreign('asignaturaId')->references('id')->on('asignatura')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pregunta');
    }
};
