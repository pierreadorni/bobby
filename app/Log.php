<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    /**
     * @var string $table
     */
    protected $table = 'logs';

    /**
     * @var array $guarded
     */
    protected $guarded = ['id'];
}
