<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('lost_pets', function (Blueprint $t) {
        if (! Schema::hasColumn('lost_pets', 'posted_at')) {
            $t->timestamp('posted_at')->nullable();
        }
    });
}

public function down()
{
    Schema::table('lost_pets', function (Blueprint $t) {
        if (Schema::hasColumn('lost_pets', 'posted_at')) {
            $t->dropColumn('posted_at');
        }
    });
}


};
