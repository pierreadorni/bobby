<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
	use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];



    protected $fillable = [
		'name','description', 'quantity','place','status','caution','type','association',
	];
	protected $table = 'items';

	public function associations()
	{
		return $this->belongsTo('App\Association', 'association');
	}

	public function itemtypes()
	{
		return $this->belongsTo('App\ItemType', 'type');
	}

	public function itemplaces()
	{
		return $this->belongsTo('App\ItemPlace', 'place');
	}

}
