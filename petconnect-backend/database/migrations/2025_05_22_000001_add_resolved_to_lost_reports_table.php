<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lost_reports', function (Blueprint $table) {
            $table->boolean('resolved')->default(false)->after('photo');
        });
    }

    public function down(): void
    {
        Schema::table('lost_reports', function (Blueprint $table) {
            $table->dropColumn('resolved');
        });
    }
};
