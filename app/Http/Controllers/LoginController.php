<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LoginController extends Controller
{

	/**
     * @param $service
     * @param $ticket
     * @return array returns the sessionid fetch from payutc
     * @throws PayutcException
     */
    public function fetchPayutcSessionId($service, $ticket) {
        $payutc = Payutc::loginCas2($ticket, $service);
        //\Log::info($payutc->sessionid);
        return [
            'username'  => $payutc->username,
            'sessionid' => $payutc->sessionid,
        ];
    }

	/**
     *  Retourne un token
     *
     */
    private function getToken() {
      return bin2hex(random_bytes(78));
    }


    /**
     *  Processus de login: connexion par CAS et génération de token
     *
     */
    public function login() {

		// Adresse vers laquelle on redirige
		//$webapp = Request::input('webapp');
		$webapp = Request('webapp');

		// Ticket CAS
		//$ticket = Request::input('ticket');
		$ticket = Request('ticket');

		// URL transmise au CAS pour la connexion et pour la vérification du ticket
		$service = route('login', ['webapp' => $webapp]);

		// Si l'URL de la webapp n'est pas donnée, on abandonne
		if(!$webapp) {
		return response()->json(array("error" => "400, bad request, webapp URL required"), 400);
		}

		if(!$ticket) {
			// Si le ticket n'est pas transmis, on donne l'URL vers le CAS
			$url = 'https://cas.utc.fr/cas/login?service='.urlencode($service);
			$data = array('url' => $url);
			return response()->json($data);
		}
      else {
        try {
            //$payutc = $this->fetchPayutcSessionId($service, $ticket);
            // On vérifie que le ticket est valide
            #$data = $this->serviceValidate($service, $ticket);


            // Succès de la récupération d'informations du CAS, on récupère les infos qui nous intéressent (=login)
            //$login = $payutc['username'];


            // L'utilisateur est autorisé. On lui génère un token dans la table Logs
            $token = $this->getToken();
            /*\log::info("sess : ".$payutc['sessionid']);
            $log = new Log([
                'token'            => $token,
                'CAS'              => Request::input('ticket'),
                'payutc_sessionid' => $payutc['sessionid'],
            ]);
            $log->member()->associate($member);
            $log->save();*/

            // Puis on le redirige vers sa webapp, avec le token

            //dd($webapp.'?token='.$token);
            return redirect($webapp.'?token='.$token);

        } catch (AuthenticationException $e) {
            return response()->json(array("error" => "401, ".$e->getMessage()), 401);
        } catch (PayutcException $e) {
            return response()->json(array(
                "error" => "Impossible de s'authentifier avec Payutc. (".$e->getMessage().")",
            ), 400);
        }
      }
    }
}
