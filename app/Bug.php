<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Bug extends Model
{

    protected $fillable = [
		'title', 'comment'
    ];
    
	protected $table = 'bugs';

}
