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
        Schema::create('examen', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->dateTime('fhInicio')->nullable();
            $table->dateTime('fhFinal')->nullable();
            $table->unsignedBigInteger('usuarioId');
            $table->unsignedBigInteger('asignaturaId');
            $table->boolean('active')->default(false);
            $table->timestamps();

            $table->foreign('usuarioId')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('asignaturaId')->references('id')->on('asignatura')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examen');
    }
};
