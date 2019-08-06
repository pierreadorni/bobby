<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookingLine extends Model
{

	use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at', 'startDate', 'endDate'];



    protected $fillable = [
		'booking','item', 'quantity', 'startDate', 'status', 'endDate'
	];

	protected $table = 'booking_lines';

	// protected $appends = ['item'];

	public function bookings()
	{
		$this->belongsTo('App\BookingLine', 'booking');
	}

	public function item()
	{
		return $this->belongsTo('App\Item', 'item');
	}

}