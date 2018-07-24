<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AssoUser extends Model
{
    protected $fillable = [
		'association','user',
	];
	protected $table = 'asso_users';
}
