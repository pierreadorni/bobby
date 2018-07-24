<?php

use Illuminate\Database\Seeder;
use App\Association;

class AssociationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $associations = [
        	[
        		'name' => 'Integration UTC',
        		'parent_id'	=>	null,
        		'mail'	=>	'integutc@gmail.com',
	        ],
	        [
        		'name' => 'BDE',
        		'parent_id'	=>	null,
        		'mail'	=>	'bdeutc@gmail.com',
	        ],
	        [
        		'name' => 'Imaginarium Festival',
        		'parent_id'	=>	null,
        		'mail'	=>	'if@gmail.com',
	        ],
        ];

        foreach ($associations as $association => $values){
            Association::create($values);
        }

    }
}
