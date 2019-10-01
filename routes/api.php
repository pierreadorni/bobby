<?php

use Illuminate\Http\Request;
use App\User;
use App\ItemType;
use App\Item;
use App\Association;
use Illuminate\Support\Str;
use App\Booking;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/', function () {
    return view('app');
});


Route::prefix('v1')->group(function () {

    /**
    *   AUTHENTIFICATIOn
    *
    */

    Route::get('/login', 'LoginController@login');

    Route::get('/code', 'LoginController@authorization_code');

    Route::group(['middleware' => 'PortailAuth'], function () {


        /**
        *   ASSOCIATIONS
        *
        */

        Route::apiResource('associations', 'AssociationController');


        /**
        *   BOOKINGS
        *
        */

        Route::apiResource('bookings', 'BookingController')->only(['index',
        'store', 'show']);

        Route::get('booking/items/{asso_id}', function($asso_id){
            return Item::where([
                ['association_id', $asso_id],
                ['status', 1]
            ])->select('id', 'name', 'quantity', 'association_id')
            ->get();
        });
    
        Route::get('bookings/asso/{asso_id}', 'BookingController@indexAssociation');

        Route::post('bookings/caution/{id}', 'BookingController@cautionReceived');

        Route::get('bookings/accept/{id}', 'BookingController@acceptBooking');

        Route::get('bookings/cancel/{id}', 'BookingController@cancelBooking');

        Route::get('bookings/returned/{id}', 'BookingController@returnedBooking');


        /**
        *   BOOKINGLINES
        *
        */

        Route::apiResource('bookinglines', 'BookingLineController')->only(['update']);

        Route::get('bookinglines/accept/{id}', 'BookingLineController@acceptLine');

        Route::get('bookinglines/cancel/{id}', 'BookingLineController@cancelLine');

        Route::get('bookinglines/returned/{id}', 'BookingLineController@returnedLine');


        /**
         *  BUG
         * 
         */

        Route::apiResource('bugs', 'BugController')->only(['index', 'store', 'destroy']);
        


        /**
        *   ITEM
        *
        */

        Route::apiResource('items', 'ItemController');

        Route::get('association/items/{uid}', 'ItemController@itemFromAssociation');

        Route::get('items/categories/{categorie}', 'ItemController@itemFromCategorie');

        Route::get('export/items/{asso_id}', 'ItemController@exportItem');

        Route::post('import/items/{asso_id}', 'ItemController@importItem');


        /**
        *   ITEMPLACE
        *
        */

        Route::apiResource('itemplaces', 'ItemPlaceController');


        /**
        *   ITEMTYPE
        *
        */

        Route::apiResource('itemtypes', 'ItemTypeController');



        /**
        *   LOGOUT
        *
        */

        Route::get('logout', 'LoginController@logout');



        /**
        *   MAIL
        *
        */

        Route::post('send', 'MailController@send');


        /**
        *   USER
        *
        */

        Route::get('user', 'UserController@getUser');

        Route::get('userassos', 'UserController@userAssociations');

        Route::get('permissions', 'UserController@getPermissions');      

    });

});
