<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BookingLine extends Model
{
    protected $fillable = [
		'booking','item', 'quantity', 'startDate', 'status', 'endDate'
	];

	protected $table = 'booking_lines';

	public function bookings()
	{
		$this->belongsTo('App\BookingLine');
	}

	public function items()
	{
		$this->belongsTo('App\Item');
	}
}
