<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('activities', function (Blueprint $table) {
            if (! Schema::hasColumn('activities', 'user_id')) {
                $table->foreignId('user_id')
                      ->nullable()
                      ->after('id')
                      ->constrained()
                      ->onDelete('cascade');
            }
        });
    }

    public function down()
    {
        Schema::table('activities', function (Blueprint $table) {
            // Solo soltamos la columna (sin tocar la FK)
            if (Schema::hasColumn('activities', 'user_id')) {
                $table->dropColumn('user_id');
            }
        });
    }
};
