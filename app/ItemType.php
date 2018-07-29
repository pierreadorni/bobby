<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ItemType extends Model
{
    protected $fillable = [
		'name', 'picture',
	];
	protected $table = 'itemTypes';

	public function items()
	{
		return $this->hasMany('App\Item', 'type');
	}
}
