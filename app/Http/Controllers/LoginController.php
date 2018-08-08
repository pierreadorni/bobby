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
        if ($request->filled('code')){

            //dd($request->filled('code'));
            $token =  $this->get_token($request);
            //dd($response['access_token']);
            
            //$token = $response->access_token;
            $response = ["token" => $token];
            //dd($response);
            return response()->json($response, 200);
        }
        else
            return $this->authorization_code();
    }


    public function authorization_code(){
        $query = http_build_query([
        'client_id' => 4,
        'redirect_uri' => 'http://localhost:8000/login',
        'response_type' => 'code',
        'scope' => 'user-get-info-identity-email user-get-info-identity-type-contributorBde user-get-assos',
        ]);

        $response = ["url" => 'https://portail.nastuzzi.fr/oauth/authorize?'.$query];

        dd($response);
        //return response()->json($response, 200);
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
                /*'code' => 'def50200138f2f521e6bbf4cbd6f276a56abe1f8790d6d6a7ff28a055d09a5a24dbf87b2934224d90587f940346a54d2c8fa6600fbca587c7d27769f377570e1b701d9d25b2a6d093a613bf494fafcc4362c286b21539a60518084cb20593326b35617fda9bc445ac4ca4dd30e7cdc4de87b67448bd7403f970e07eb8d6d452d6ff2f2bcc91eb8a785cdc1913924e1866aa6857bb654e56df35355013aa670366081ca93950002b64bc3ebc2db309d059ec9578882912183653558ce935e56f31bce85f2c4005ade8aafaa5d7aadf0d4521c706805bd99c5fe1ffb359bfbf29229ec91e664a0b5184ee007b36d150eb2cdbfe58ad284066e1d92ddbcae6de3ffe3b29705711c816a2b15345d76052972b20e817e4b8179449026c5c3cb08159d674852edd0053bf7148a96787c6d84508419421269bb8b192d122e29d1caa947529bdd33056d250314e665d36ccbe13c83a87a5dbedf5c84990d83ba5fad40213a2c66755ebf614469f0383bb9ea86906503a8fda2ae46f2c41f07f5494e721577329dabd7f8222defae81bd02aef10bd2d58080ae540b86157ed03707fb9d8283b4e57735dfca5762bbeabb5a8fc1b3b7376322db7cdd0f36'*/
            ]
        ]);
        //dd($response);
        //dd(json_decode((string) $response->getBody(), true));
        $response = json_decode((string) $response->getBody(), true);
        return $response['access_token'];
    }
}
