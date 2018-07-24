<?php

use Illuminate\Database\Seeder;
use App\ItemType;

class ItemTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $item_types = [
        	[
        		'name' => 'Mobilier intérieur',
                'picture'   =>  'images/mobilint.jpg',
	        ],
	        [
                'name' => 'Mobilier extérieur',
                'picture'   =>  'images/barnum.jpg',
            ],
	        [
                'name' => 'Sécurité',
                'picture'   =>  'images/securite.jpg',
            ],
            [
                'name' => 'Outils',
                'picture'   =>  'images/outils.jpg',
            ],
            [
                'name' => 'Cuisine',
                'picture'   =>  'images/cuisine.png',
            ],
            [
                'name' => 'Décoration',
                'picture'   =>  'images/deco.jpg',
            ],
            [
                'name' => 'Jeux',
                'picture'   =>  'images/jeux.jpg',
            ],
            [
                'name' => 'High Tech',
                'picture'   =>  'images/hightech.jpg',
            ],
            [
                'name' => 'Divers',
                'picture'   =>  null,
            ],
        ];

        foreach ($item_types as $item_type => $values){
            ItemType::create($values);
        }

    }
}
