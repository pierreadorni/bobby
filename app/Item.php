<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
	use SoftDeletes;

	protected $table = 'items';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];



    protected $fillable = [
		'name','description', 'quantity','place_id','status','caution','type_id','association_id',
	];
	

	public function associations()
	{
		// return $this->belongsTo('App\Association', 'association_id');
		// return Portail::showAsso($this->association_id);
	}

	public function type()
	{
		return $this->belongsTo('App\ItemType', 'type_id');
	}

	public function place()
	{
		return $this->belongsTo('App\ItemPlace', 'place_id');
	}

}
