<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLostPetsTable extends Migration
{
    public function up()
    {
        Schema::create('lost_pets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('pet_name', 100)->nullable();
            $table->text('description')->nullable();
            $table->string('photo')->nullable();
            $table->string('last_seen_location')->nullable();
            $table->timestamp('posted_at')->useCurrent();
            $table->boolean('found')->default(false);
        });
    }

    public function down()
    {
        Schema::dropIfExists('lost_pets');
    }
}
