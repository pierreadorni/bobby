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
                //dd($token);
                $http = new Client([
                    'base_uri' => 'https://portail.nastuzzi.fr/api/v1/',
                    'headers' => [
                        'Authorization' => $token['token_type'].' '.$token['access_token'],
                    ],
                ]);
                $response = $http->get('user');
                $userData = json_decode((string) $response->getBody(), true);

                //uth::login(User::firstOrCreate([

                User::updateOrCreate([
                    'id' => $userData['id'],
                ],[
                    'email' => $userData['email'],
                    'firstname' => $userData['firstname'],
                    'lastname' => $userData['lastname'],
                    'token' => $token['access_token'],
                    'refresh_token' => $token['refresh_token'],
                ]);
                //return redirect('/');
                //dd($toekn);
                //$data = ['url' => 'http://localhost:8000/#!/login?token='.$token];
                //return response()->json($data);
                return redirect('http://localhost:8000/#!/login?token='.$token["access_token"]);
            //} catch (ClientException $e) {}
        }
        return ($this->authorization_code()['url']);
    }
    public function authorization_code(){
        $query = http_build_query([
            'client_id' => '4a6f7373-656c-696e-203d-20426f626279',
            'redirect_uri' => 'http://localhost:8000/login',
            'response_type' => 'code',
            //'scope' => 'user-get-info-identity-email user-get-info-identity-type-contributorBde user-get-assos, user-get-roles-users',
            'scope' =>  'user-get-info user-get-assos user-get-roles-users',
        ]);
        return ["url" => 'https://portail.nastuzzi.fr/oauth/authorize?'.$query];
        //return ('https://portail.nastuzzi.fr/oauth/authorize?'.$query);
    }

    public function get_token(Request $request){
        $http = new Client;

        //dd($request->code);

        $response = $http->post('https://portail.nastuzzi.fr/oauth/token', [
            'form_params' => [
                'grant_type' => 'authorization_code',
                'client_id' => '4a6f7373-656c-696e-203d-20426f626279',
                'client_secret' => 'password',
                'redirect_uri' => 'http://localhost:8000/login',
                'code' => $request->code,
            ],
        ]);

        return json_decode((string) $response->getBody(), true);
    }

}
