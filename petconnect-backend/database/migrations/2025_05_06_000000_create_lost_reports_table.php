<?php
// petconnect-backend/database/migrations/2025_05_06_000000_create_lost_reports_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLostReportsTable extends Migration
{
    public function up()
    {
        Schema::create('lost_reports', function (Blueprint $table) {
            $table->id();
            // Quién hace el reporte
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Si es “perdí mi mascota” guardamos la pet; sino nulo
            $table->foreignId('pet_id')->nullable()->constrained()->onDelete('set null');
            // Tipo de reporte: lost = la perdí | found = la encontré
            $table->enum('type',['lost','found']);
            // Comentarios arbitrarios
            $table->text('comment')->nullable();
            // Fecha del suceso (por defecto ahora)
            $table->timestamp('happened_at')->useCurrent();
            // Geo localización
            $table->decimal('latitude',10,7)->nullable();
            $table->decimal('longitude',10,7)->nullable();
            // Foto opcional
            $table->string('photo')->nullable();
            // Estado sólo aplicable a “lost”: si ya la han marcado como encontrada
            $table->boolean('resolved')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('lost_reports');
    }
}
