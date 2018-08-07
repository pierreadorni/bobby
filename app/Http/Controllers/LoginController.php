<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class LoginController extends Controller
{



    /**
     *  Processus de login: connexion par le Portail des assos et génération de token
     *
     */
    public function login(Request $request) {
        if ($request->filled('code'))
            return $this->get_token($request);
        else
            return redirect($this->authorization_code());
    }


    public function authorization_code(){
        $query = http_build_query([
        'client_id' => 4,
        'redirect_uri' => 'http://localhost:8000/login',
        'response_type' => 'code',
        'scope' => '',
        ]);

        return 'https://portail.nastuzzi.fr/oauth/authorize?'.$query;
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
