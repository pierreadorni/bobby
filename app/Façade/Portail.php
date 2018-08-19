<?php
/**
 * Created by PhpStorm.
 * User: corentinhembise
 * Date: 30/11/2017
 * Time: 10:35
 */

namespace App\Facade;

use Illuminate\Support\Facades\Facade;

class Portail extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'Portail';
    }
}