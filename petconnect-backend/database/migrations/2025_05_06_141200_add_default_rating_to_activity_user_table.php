<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_user', function (Blueprint $table) {
            $table->unsignedTinyInteger('rating')->nullable()->change();
        });

        // Check (MySQL/MariaDB 10.4+)
        DB::statement('ALTER TABLE activity_user
                       ADD CONSTRAINT chk_activity_user_rating
                       CHECK (rating IS NULL OR rating BETWEEN 1 AND 5)');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE activity_user
                       DROP CONSTRAINT chk_activity_user_rating');

        Schema::table('activity_user', function (Blueprint $table) {
            $table->tinyInteger('rating')->nullable()->change();
        });
    }
};
