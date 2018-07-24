<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ItemType extends Model
{
    protected $fillable = [
		'name', 'picture',
	];
	protected $table = 'item_types';

	public function items()
	{
		return $this->hasMany('App\Item', 'type');
	}
}
