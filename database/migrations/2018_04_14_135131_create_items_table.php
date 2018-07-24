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
            $table->increments('id');
            $table->string('name');
            $table->string('description')->nullable();
            $table->integer('quantity')->unsigned();
            $table->integer('place')->unsigned();
            $table->boolean('status');
            $table->integer('caution')->unsigned();
            $table->integer('type')->unsigned();
            $table->integer('association')->unsigned();

            $table->foreign('association')->references('id')->on('associations');
            $table->foreign('type')->references('id')->on('item_types');
            $table->foreign('place')->references('id')->on('item_places');

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
