<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Association extends Model
{
    protected $fillable = [
		'name','parent_id', 'mail',
	];

	protected $table = 'associations';

	public function users()
	{
		return $this->belongsToMany('App\User', 'asso_users');
	}

	public function items()
	{
		return $this->hasMany('App\Item', 'association');
	}

	public function bookings()
	{
		return $this->hasMany('App\Booking', 'owner');
	}
}
