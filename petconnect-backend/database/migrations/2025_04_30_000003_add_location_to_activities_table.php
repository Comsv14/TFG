<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('activities', function (Blueprint $table) {
            if (! Schema::hasColumn('activities', 'latitude')) {
                $table->decimal('latitude', 10, 7)
                      ->nullable()
                      ->after('location');
                $table->decimal('longitude', 10, 7)
                      ->nullable()
                      ->after('latitude');
            }
        });
    }

    public function down()
    {
        Schema::table('activities', function (Blueprint $table) {
            if (Schema::hasColumn('activities', 'latitude')) {
                $table->dropColumn(['latitude', 'longitude']);
            }
        });
    }
};
