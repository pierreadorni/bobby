<?php

use Illuminate\Database\Seeder;
use App\ItemPlace;

class ItemPlacesTableSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $item_places = [
        	[
        		'name' => 'Garage 7',
	        ],
	        [
                'name' => 'Garage 8',
            ],
            [
                'name' => 'Stockage PVDC',
            ],
            [
                'name' => 'Pic',
            ],
        ];

        foreach ($item_places as $item_place => $values){
            ItemPlace::create($values);
        }

    }
}
