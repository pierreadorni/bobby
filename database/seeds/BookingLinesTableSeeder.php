<?php

use Illuminate\Database\Seeder;
use App\BookingLine;

class BookingLinesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $booking_lines = [
        	[
        		'booking' => 1,
        		'item'	=>	2,
        		'quantity'	=>	1,
                'date' => '2018-04-14',
                'status' =>  'In',
	        ],
	        [
        		'booking' => 1,
        		'item'	=>	2,
        		'quantity'	=>	1,
                'date' => '2018-04-10',
                'status' =>  'In',
	        ],
	        [
        		'booking' => 3,
        		'item'	=>	1,
        		'quantity'	=>	10,
                'date' => '2018-03-14',
                'status' =>  'Out',
	        ],
        ];

        foreach ($booking_lines as $booking_line => $values){
            BookingLine::create($values);
        }

    }
}
