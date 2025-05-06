<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_user', function (Blueprint $t) {
            // rating 1‑5 (nullable por si hay inscripciones antiguas)
            $t->tinyInteger('rating')->nullable()->after('user_id');

            // si quieres tener los timestamps normales de Laravel
            if (!Schema::hasColumn('activity_user', 'created_at')) {
                $t->timestamps();               // añade created_at y updated_at
            }
        });
    }

    public function down(): void
    {
        Schema::table('activity_user', function (Blueprint $t) {
            $t->dropColumn('rating');
            // no quitamos los timestamps para no perder datos
        });
    }
};
