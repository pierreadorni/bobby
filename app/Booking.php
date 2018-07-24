<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
		'owner','booker', 'user', 'status', 'cautionReceived', 'caution'
	];

	protected $table = 'bookings';

	public function bookinglines()
	{
		return $this->hasMany('App\BookingLine', 'booking');
	}

	public function items()
	{
		return $this->hasManyThrought(
		 	'App\Item',
            'App\BookingLine',
            'booking', // Foreign key on users table...
            'item', // Foreign key on posts table...
            'id', // Local key on countries table...
            'id' // Local key on users table...
        );
	}
}
