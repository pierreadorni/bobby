<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ItemPlace extends Model
{
    protected $fillable = [
		'name'
	];
	protected $table = 'item_places';

	public function items()
	{
		return $this->hasMany('App\Item', 'place');
	}
}

