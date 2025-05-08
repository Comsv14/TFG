<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateActivityRatingsTable extends Migration
{
    public function up()
    {
        Schema::create('activity_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('rating'); // Valoración de 1 a 5
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('activity_ratings');
    }
}
