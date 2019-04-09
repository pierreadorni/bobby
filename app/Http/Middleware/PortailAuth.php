<?php

namespace App\Http\Middleware;

use Gate;
use Auth;
use Closure;
use App\User;
use Portail;

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

            // Récupère du token
            $token = $request->header("Authorization");

            // Authenticate the user based on the token
            Portail::authenticateUser($token);

            if (Portail::isAuthenticated()) {
            
                return $next($request);
            
            } else {
             
                return response()->json(array("error" => "401, unauthorized, token not recognized"), 401);
            
            }
        
        } else {
       
            // Absence du header Authorization
            return response()->json(array("error" => "401, unauthorized, token not provided"), 401);

        }
    }
}
