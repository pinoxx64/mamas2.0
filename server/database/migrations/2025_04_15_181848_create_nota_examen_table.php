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
        Schema::create('nota_examen', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('examenId');
            $table->unsignedBigInteger('usuarioId');
            $table->decimal('nota')->default(0.00);
            $table->timestamps();

            $table->foreign('examenId')->references('id')->on('examen')->onDelete('cascade');
            $table->foreign('usuarioId')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nota_examen');
    }
};
