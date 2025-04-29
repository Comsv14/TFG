<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Solo agregar si no existe
            if (! Schema::hasColumn('users', 'avatar')) {
                // La añadimos justo después de 'password' (no asumimos remember_token)
                $table->string('avatar')
                      ->nullable()
                      ->after('password');
            }
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Solo eliminar si existe
            if (Schema::hasColumn('users', 'avatar')) {
                $table->dropColumn('avatar');
            }
        });
    }
};
