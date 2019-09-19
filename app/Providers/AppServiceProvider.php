<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use App\Libraries\Portail;
use App;
use App\Libraries\MailSender;

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
            return new Portail();
        });

        App::singleton('MailSender', function() {
            return new MailSender();
        });
    }
}
