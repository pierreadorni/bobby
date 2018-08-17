<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

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

    public function associations()
    {
        return $this->belongsToMany('App\Association', 'asso_users', 'user', 'association');
    }
}
