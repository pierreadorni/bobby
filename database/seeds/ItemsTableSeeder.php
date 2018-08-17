<?php

use Illuminate\Database\Seeder;
use App\Item;

class ItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
        	[
        		'name' => 'Barnum',
        		'description'	=>	null,
        		'quantity'	=>	10,
                'place' => 1,
                'status' =>  true,
                'caution' => 300,
                'type' => 1,
                'association' => 1,
	        ],
	        [
                'name' => 'Barbecue',
                'description'   =>  null,
                'quantity'  =>  10,
                'place' => 2,
                'status' =>  true,
                'caution' => 300,
                'type' => 1,
                'association' => 1,
            ],
	        [
                'name' => 'Passe Cable',
                'description'   =>  null,
                'quantity'  =>  10,
                'place' => 3,
                'status' =>  true,
                'caution' => 300,
                'type' => 1,
                'association' => 1,
            ],
            [
                'name' => 'Cintre',
                'description'   =>  null,
                'quantity'  =>  10,
                'place' => 3,
                'status' =>  true,
                'caution' => 300,
                'type' => 1,
                'association' => 2,
            ],
        ];

        foreach ($items as $item => $values){
            Item::create($values);
        }

    }
}
