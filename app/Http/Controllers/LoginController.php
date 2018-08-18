<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use App\User;

class LoginController extends Controller
{
    public function __construct() {
        $this->middleware('guest');
    }

    /**
     *  Processus de login: connexion par le Portail des assos et génération de token
     *
     */
    public function login(Request $request) {

        if($request->code){
            //try {
                $token = $this->get_token($request);

                $http = new Client([
                    'base_uri' => env('BASE_URI').'/api/v1/',
                    'headers' => [
                        'Authorization' => $token['token_type'].' '.$token['access_token'],
                    ],
                ]);
                $response = $http->get('user');
                $userData = json_decode((string) $response->getBody(), true);

                User::updateOrCreate([
                    'id' => $userData['id'],
                ],[
                    'email' => $userData['email'],
                    'firstname' => $userData['firstname'],
                    'lastname' => $userData['lastname'],
                    'token' => $token['access_token'],
                    'refresh_token' => $token['refresh_token'],
                ]);

                //dd(env('APP_URL').'/#!/login?token='.$token["access_token"]);
                //return redirect(env('APP_URL').'/#!/login?token='.$token["access_token"]);
                return redirect('/#!/login?token='.$token["access_token"]);
            //} catch (ClientException $e) {}
        }
        return ($this->authorization_code()['url']);
    }

    public function authorization_code(){
        
        $query = http_build_query([
            'client_id' => env('CLIENT_ID'),
            'redirect_uri' => env('REDIRECT_URI'),
            'response_type' => 'code',
            //'scope' => 'user-get-info-identity-email user-get-info-identity-type-contributorBde user-get-assos, user-get-roles-users',
            'scope' =>  'user-get-info user-get-assos user-get-roles-users',
        ]);
        return ["url" => env('BASE_URI').'/oauth/authorize?'.$query];
    }

    public function get_token(Request $request){

        $http = new Client;

        $response = $http->post(env('BASE_URI').'/oauth/token', [
            'form_params' => [
                'grant_type' => env('GRANT_TYPE'),
                'client_id' => env('CLIENT_ID'),
                'client_secret' => env('CLIENT_SECRET'),
                'redirect_uri' => env('REDIRECT_URI'),
                'code' => $request->code,
            ],
        ]);

        return json_decode((string) $response->getBody(), true);
    }

}
