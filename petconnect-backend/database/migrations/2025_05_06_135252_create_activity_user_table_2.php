<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('activity_user', function (Blueprint $t) {
            $t->id();
            $t->foreignId('activity_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->tinyInteger('rating')->nullable();   // 1‑5
            $t->timestamps();

            $t->unique(['activity_id','user_id']);   // un solo registro por user
        });
    }
    public function down() { Schema::dropIfExists('activity_user'); }
};
