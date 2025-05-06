<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $t) {
            // ends_at YA existe → colocamos finished_at justo después
            $t->timestamp('finished_at')
              ->nullable()
              ->after('ends_at');
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $t) {
            $t->dropColumn('finished_at');
        });
    }
};
