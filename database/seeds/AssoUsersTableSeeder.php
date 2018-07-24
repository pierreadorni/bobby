<?php

use Illuminate\Database\Seeder;
use App\AssoUser;

class AssoUsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $asso_users = [
        	[
        		'association' => 1,
                'user'  =>  3,
	        ],
	        [
                'association' => 2,
                'user'  =>  3,
            ],
	        [
                'association' => 3,
                'user'  =>  3,
            ],
        ];

        foreach ($asso_users as $asso_user => $values){
            AssoUser::create($values);
        }

    }
}
