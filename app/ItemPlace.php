<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ItemPlace extends Model
{

	use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];


    protected $fillable = [
		'name'
	];
	protected $table = 'itemPlaces';

	public function items()
	{
		return $this->hasMany('App\Item', 'place_id');
	}
}

