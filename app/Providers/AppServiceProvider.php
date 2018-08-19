<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use App\Libraries\Portail;
use App;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot() {
        Schema::defaultStringLength(191);       // Pour que 'email' puisse être une clé
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
    App::singleton('Portail', function() {
       /* $required = function() {
            throw new \InvalidArgumentException("Missing NEMOPAY_API_URL or NEMOPAY_APP_KEY or NEMOPAY_FUN_ID in '.env' file. (Run `php artisan config:clear` to update env variables)");
        };
        $apiUrl = env('NEMOPAY_API_URL', $required);
        $appKey = env('NEMOPAY_APP_KEY', $required);
        $funId = env('NEMOPAY_FUN_ID', $required);
        $proxy = env('PROXY_UTC');
        $categObjId = env('NEMOPAY_CATEGORY_OBJ_ID');
        $categServiceId = env('NEMOPAY_CATEGORY_SERVICE_ID');
        $activate = boolval(env('NEMOPAY_ACTIVATE'));*/

        return new Portail();
    });
    }
}
