<?php

use Illuminate\Database\Seeder;
use App\Booking;

class BookingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $bookings = [
        	[
        		'owner' => 1,
        		'booker'	=>	2,
        		'user'	=>	1,
                'status'    =>  'en cours',
                'cautionReceived' => false,
                'caution' =>  300,
	        ],
	        [
                'owner' => 2,
                'booker'    =>  3,
                'user'  =>  1,
                'status'    =>  'en cours',
                'cautionReceived' => true,
                'caution' =>  300,
            ],
	        [
                'owner' => 1,
                'booker'    =>  2,
                'user'  =>  2,
                'status'    =>  'en cours',
                'cautionReceived' => false,
                'caution' =>  300,
            ],
        ];

        foreach ($bookings as $booking => $values){
            Booking::create($values);
        }

    }
}
