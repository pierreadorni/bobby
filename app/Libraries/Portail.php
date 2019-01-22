<?php
namespace App\Libraries;


use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class Portail
{
    
    public function indexAsso(Request $request)
    {
        $auth = $request->header('Authorization');

        $http = new Client([
            'base_uri' => env('BASE_URI').'/api/v1/',
            'headers' => [
                'Authorization' => $auth,
            ],
        ]);
        $response = $http->get('assos');
        $assos = json_decode((string) $response->getBody(), true);

        //A refaire pour récupérer mail de l'asso
        /*foreach ($$assos as $asso) {
            $responseContact = $http->get('assos/'.$uid.'/contacts');
            $asso->email = json_decode((string) $response->getBody(), true);
        }*/

        return $assos;
    }


    public function showAsso(Request $request, $uid)
    {

        $auth = $request->header('Authorization');

        
        $http = new Client([
            'base_uri' => env('BASE_URI').'/api/v1/',
            'headers' => [
                'Authorization' => $auth,
            ],
        ]);
        $response = $http->get('assos/'.$uid);
        $asso = json_decode((string) $response->getBody(), true);

        //A refaire pour récupérer mail
        /*$responseContact = $http->get('assos/'.$uid.'/contacts');
        $asso->email = json_decode((string) $response->getBody(), true);*/
        
        return $asso;
    }

    public function getInfoUser(Request $request)
    {

        $auth = $request->header('Authorization');

        $http = new Client([
            'base_uri' => env('BASE_URI').'/api/v1/',
            'headers' => [
                'Authorization' => $auth,
            ],
        ]);
        $response = $http->get('user');
        $user = json_decode((string) $response->getBody(), true);

        //dd($user);
        //Récupérer mail !

        return $user;
    
    }

    public function getUserAssociation(Request $request)
    {
        $auth = $request->header('Authorization');

        $http = new Client([
            'base_uri' => 'https://portail.nastuzzi.fr/api/v1/',
            'headers' => [
                'Authorization' => $auth,
            ],
        ]);
        $response = $http->get('user/assos');
        $assos = json_decode((string) $response->getBody(), true);
        return $assos;
    }

}
