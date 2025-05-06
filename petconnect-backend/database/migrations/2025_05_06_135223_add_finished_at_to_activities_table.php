<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(){
        Schema::table('activities', function (Blueprint $t){
            $t->timestamp('finished_at')->nullable()->after('end_date');
        });
    }
    public function down(){
        Schema::table('activities', fn (Blueprint $t) => $t->dropColumn('finished_at'));
    }
};
