<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLostPetSightingsTable extends Migration
{
    public function up()
    {
        Schema::create('lost_pet_sightings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lost_pet_id')->constrained('lost_pets')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('location')->nullable();
            $table->text('comment')->nullable();
            $table->string('photo')->nullable();
            $table->timestamp('sighted_at')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('lost_pet_sightings');
    }
}
