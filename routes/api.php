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

        Route::get('booking/assos/{asso_id}', function($asso_id){
            // Portail::hasAssociationAdminPermission($asso_id);
            return $assos = Association::all()->where('id', '<>', $asso_id);
        });

        Route::get('booking/items/{asso_id}', function($asso_id){
            // Portail::isAuthenticated();
            return Item::where([
                ['association_id', $asso_id],
                ['status', 1]
            ])->select('id', 'name', 'description', 'quantity', 'association_id')
            ->get();
        });

        Route::get('booking/validation/item/{item_id}', function($item_id){
            // Portail::isAuthenticated();
            $item = Item::find($item_id)->caution;
            return($item);
        });

        Route::post('booking/validation/items', 'BookingController@calculCaution');
    
        Route::get('bookings/asso/{asso_id}', 'BookingController@indexAssociation');

        Route::post('bookings/cancel/{id}', 'BookingController@cancelBooking');

        Route::post('bookings/caution/{id}', 'BookingController@cautionReceived');


        /**
        *   BOOKINGLINES
        *
        */

        Route::apiResource('bookinglines', 'BookingLineController');



        /**
        *   ITEM
        *
        */

        Route::apiResource('items', 'ItemController');

        Route::get('association/items/{uid}', 'ItemController@itemFromAssociation');

        Route::get('items/categories/{categorie}', 'ItemController@itemFromCategorie');

        Route::get('export/items', 'ItemController@exportItem');


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
        *   MAIL
        *
        */

        Route::post('/send', 'MailController@send');


        /**
        *   USER
        *
        */

        Route::get('user', 'UserController@getUser');

        Route::get('userassos', 'UserController@userAssociations');

        Route::get('permissions', 'UserController@getPermissions');      

    });

});
