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
        Schema::create('correcion_examen', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('respuestaId');
            $table->boolean('correcta')->default(false);

            $table->foreign('respuestaId')->references('id')->on('respuesta_examen')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('correcion_examen');
    }
};
