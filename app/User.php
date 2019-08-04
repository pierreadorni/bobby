<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'email', 'firstname', 'lastname', 'token', 'refresh_token',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */


    protected $table = 'users';
    /*protected $hidden = [
        'password', 'remember_token',
    ];*/

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'string',
    ];

    public function associations()
    {
        return $this->belongsToMany('App\Association', 'asso_users', 'user', 'association');
    }
}
