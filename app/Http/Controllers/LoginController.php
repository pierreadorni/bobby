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
        if ($request->filled('code')) {
            try {
                $token = $this->get_token($request);

                $http = new Client([
                    'base_uri' => 'https://portail.nastuzzi.fr/api/v1/',
                    'headers' => [
                        'Authorization' => $token['token_type'].' '.$token['access_token'],
                    ],
                ]);

                $response = $http->get('user');
                $userData = json_decode((string) $response->getBody(), true);

                \Auth::login(User::firstOrCreate([
                    'id' => $userData['id'],
                ], [
                    'email' => $userData['email'],
                    'firstname' => $userData['firstname'],
                    'lastname' => $userData['lastname'],
                    'token' => $token['access_token'],
                    'refresh_token' => $token['refresh_token'],
                ]));

                return redirect()->route('/');
            } catch (ClientException $e) {}
        }

        return redirect($this->authorization_code()['url']);
    }


    public function authorization_code(){
        $query = http_build_query([
            'client_id' => 4,
            'redirect_uri' => 'http://localhost:8000/login',
            'response_type' => 'code',
            'scope' => 'user-get-info-identity-email user-get-info-identity-type-contributorBde user-get-assos',
        ]);

        return ["url" => 'https://portail.nastuzzi.fr/oauth/authorize?'.$query];
    }

    public function get_token(Request $request){
        $http = new Client;

        $response = $http->post('https://portail.nastuzzi.fr/oauth/token', [
            'form_params' => [
                'grant_type' => 'authorization_code',
                'client_id' => 4,
                'client_secret' => 'hvym5aTbxX0GmyX2L24Eu9ky7ddetGiMKRKxMCuk',
                'redirect_uri' => 'http://localhost:8000/login',
                'code' => $request->code,
            ]
        ]);

        return json_decode((string) $response->getBody(), true);
    }
}
