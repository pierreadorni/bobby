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
            $table->integer('quantity')->unsigned();
            $table->integer('place_id')->unsigned()->nullable();
            $table->foreign('place_id')->references('id')->on('itemPlaces')->onDelete('set null')->onUpdate('cascade');
            $table->boolean('status');
            $table->string('date_of_purchase')->nullable();
            $table->string('price')->nullable();
            $table->integer('caution')->unsigned();
            $table->integer('type_id')->unsigned()->nullable();
            $table->foreign('type_id')->references('id')->on('itemTypes')->onDelete('set null')->onUpdate('cascade');
            //Comportera l'uid de l'association sur le portial des assos
            $table->string('association_id');            

            $table->timestamps();
            $table->softDeletes();
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
