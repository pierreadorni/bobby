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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/', function () {
    return view('app');
});


Route::prefix('v1')->group(function () {
	Route::apiResources([
			'associations'		=> 'AssociationController',
			'bookings'	=> 'BookingController',
			//'users'			=> 'UserController',
			'bookinglines'			=> 'BookingLineController',
			'items'			=> 'ItemController',
			'itemtypes'		=> 'ItemTypeController',
            'itemplaces'    =>  'ItemPlaceController',
	]);

    Route::get('user', 'UserController@getUser');

    //Quand on clique sur une catégorie
    Route::get('items/categories/{categorie}', 'ItemController@itemFromCategorie');

    Route::get('association/items/{uid}', 'ItemController@itemFromAssociation');

    Route::get('booking/assos/{asso_id}', function($asso_id){
        return $assos = Association::all()->where('id', '<>', $asso_id);
    });

    Route::get('booking/items/{asso_id}', function($asso_id){
        return $items = Item::all()->where('association', $asso_id);
        //->where('status', 1);
    });

    Route::get('booking/validation/item/{item_id}', function($item_id){
        $item = Item::find($item_id)->caution;
        return($item);
    });

    Route::post('booking/validation/items', 'BookingController@calculCaution');


	Route::get('userassos', 'UserController@associations');

    Route::get('bookings/asso/{asso_id}', 'BookingController@indexAssociation');


//Route::group(['middleware' => 'cors'], function () {
    Route::get('/login', 'LoginController@login');

    Route::get('/code', 'LoginController@authorization_code');

    //Route::get('/token', 'LoginController@get_token');

    Route::post('/send', 'MailController@send');
//});
});
