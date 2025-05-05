<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLocationToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function(Blueprint $table){
            $table->string('province')->nullable()->after('email');
            $table->decimal('latitude', 10, 7)->nullable()->after('province');
            $table->decimal('longitude',10,7)->nullable()->after('latitude');
        });
    }

    public function down()
    {
        Schema::table('users', function(Blueprint $table){
            $table->dropColumn(['province','latitude','longitude']);
        });
    }
}
