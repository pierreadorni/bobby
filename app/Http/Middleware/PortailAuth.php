<?php

namespace App\Http\Middleware;

use Gate;
use Auth;
use Closure;
use App\User;

class PortailAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

      if($request->header("Authorization")) {

        // Récupère l'User associé au token
        $token = $request->header("Authorization");
        $log = User::where('token', $token)->get();

        if($log->first()) {

          // Le token existe dans la table
          $log = $log->first();

          // Vérifie que le token n'est pas désactivé ou expiré
          // Le token expire au bout de 'dt' heures.
          //$dt = 10;
          //if((time() - $log->created_at->timestamp < $dt*60*60) && !$log->disabled) {

            // A REFAIRE // 
            /*$request->attributes->add(['token' => $token]);
            Auth::login($log->member);
            Payutc::setSessionId($log['payutc_sessionid']);*/

            return $next($request);
          }
          else {
            // Le token est expiré
            return response()->json(array("error" => "401, unauthorized, token expired"), 401);
          }

        }
        else {
          // Le token n'existe pas dans la table
          return response()->json(array("error" => "401, unauthorized, token not recognized"), 401);
        }

      }
      else {
        // Absence du header Authorization
        return response()->json(array("error" => "401, unauthorized, token not provided"), 401);
      }
    }
}
