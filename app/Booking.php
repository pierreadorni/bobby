<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{

	use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];


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
