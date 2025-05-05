<?php
// database/migrations/2025_05_07_000000_add_lat_lng_to_lost_pets_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLatLngToLostPetsTable extends Migration
{
    public function up()
    {
        Schema::table('lost_pets', function (Blueprint $table) {
            $table->decimal('last_seen_latitude', 10, 7)
                  ->nullable()
                  ->after('last_seen_location');
            $table->decimal('last_seen_longitude', 10, 7)
                  ->nullable()
                  ->after('last_seen_latitude');
        });
    }

    public function down()
    {
        Schema::table('lost_pets', function (Blueprint $table) {
            $table->dropColumn(['last_seen_latitude', 'last_seen_longitude']);
        });
    }
}
