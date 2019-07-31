<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use App\User;
use Portail;
use JWTFactory;
use JWTAuth;


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

        //A mettre en production
        /*if($request->code){
            try {
                $token = $this->get_token($request);

                $http = new Client([
                    'base_uri' => env('BASE_URI').'/api/v1/',
                    'headers' => [
                        'Authorization' => $token['token_type'].' '.$token['access_token'],
                    ],
                ]);

                $response = $http->get('user/assos');
                $association = json_decode((string) $response->getBody(), true);

                //On vérifie que l'utilisateur a le droit de rentrer sur la webapp
                if($association){

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

                    return redirect('/#!/login?token='.$token["access_token"]);

                }
                else{
                    return redirect('/#!/error/401');
                }
            } catch (ClientException $e) {
                return redirect('/#!/error/500');
            }
        }
        return ($this->authorization_code()['url']);*/


        if($request->code){
            try {
                $token = $this->get_token($request);

                // $http = new Client([
                //     'base_uri' => env('BASE_URI').'/api/v1/',
                //     'headers' => [
                //         'Authorization' => $token['token_type'].' '.$token['access_token'],
                //     ],
                // ]);

                // $response = $http->get('user');
                // $userData = json_decode((string) $response->getBody(), true);
                // dd($userData);
                // User::updateOrCreate([
                //     'id' => $userData['id'],
                // ],[
                //     'email' => $userData['email'],
                //     'firstname' => $userData['firstname'],
                //     'lastname' => $userData['lastname'],
                //     'token' => $token['access_token'],
                //     'refresh_token' => $token['refresh_token'],
                // ]);
                // Authenticate the user based on the token
                // Portail::authenticateUser($request, "Bearer ".$token['access_token'], $userData);
                $portail_token = $token['token_type'].' '.$token['access_token'];
                Portail::setToken($portail_token);
                // $permissions = Portail::setPermissions($request, $token['token_type'].' '.$token['access_token'], $userData);
                // $assos = Portail::getUserAssociations($request, $token['token_type'].' '.$token['access_token']);
                $user = Portail::getUserInformation();

                User::updateOrCreate([
                    'id' => $user['id'],
                ],[
                    'email' => $user['email'],
                    'firstname' => $user['firstname'],
                    'lastname' => $user['lastname'],
                    'token' => $token['access_token'],
                    'refresh_token' => $token['refresh_token'],
                ]);

                // dd($user);
                // Create a token
                $payload = JWTFactory::user_id($user['id'])->permissions($user['permissions'])->assos($user['assos'])->make();
                $jwt_token = JWTAuth::encode($payload);
                // dd($token);

                // dd($request->session()->all());
                // dd(Portail::getUserAssociations);
                // return response()->json($userData, 200);
                // return ();
                return redirect('/#!/login?token='.$jwt_token);

            } catch (ClientException $e) {
                return redirect('/#!/error/500');
            }
        }
        return ($this->authorization_code()['url']);
    }

    public function authorization_code(){
        
        $query = http_build_query([
            'client_id' => env('CLIENT_ID'),
            'redirect_uri' => env('REDIRECT_URI'),
            'response_type' => 'code',
            // 'scope' => 'user-get-info-identity-email user-get-info-identity-type-contributorBde user-get-assos, user-get-roles-users',
            'scope' =>  'user-get-info-identity user-get-assos user-get-roles-users user-get-contacts-assos user-get-permissions',
            // 'scope' =>  ''
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
