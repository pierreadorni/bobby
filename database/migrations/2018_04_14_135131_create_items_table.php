<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name');
            $table->string('description')->nullable();
            $table->integer('quantity')->unsigned();
            $table->integer('place')->unsigned()->nullable();
            $table->foreign('place')->references('id')->on('itemPlaces')->onDelete('set null')->onUpdate('cascade');
            $table->boolean('status');
            $table->integer('caution')->unsigned();
            $table->integer('type')->unsigned()->nullable();
            $table->foreign('type')->references('id')->on('itemTypes')->onDelete('set null')->onUpdate('cascade');
            $table->integer('association')->unsigned();

            $table->foreign('association')->references('id')->on('associations');
            
            

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('items');
    }
}
