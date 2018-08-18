<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $this->call([
        	AssociationsTableSeeder::class,
            ItemPlacesTableSeeder::class,
            ItemTypesTableSeeder::class,
        	ItemsTableSeeder::class,
        ]);
    }
}
