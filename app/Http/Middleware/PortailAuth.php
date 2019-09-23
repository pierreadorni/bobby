<?php

namespace App\Http\Middleware;

use Gate;
use Auth;
use Closure;
use App\User;
use Portail;
use JWTFactory;
use JWTAuth;

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
        try {

            // Get token and decode it
            $payload = JWTAuth::parseToken()->getPayload();
            Portail::authenticateUser($payload);

            if (Portail::isAuthenticated($request)) {
        
                $user = Portail::getUser();
                \Log::info("Action effectuée par user ".$user->id." sur route ".$request->method()."::".$request->path());
                return $next($request);
            
            } else {

                \Log::info("401, unauthorized, token not recognized");
                return response()->json(array("error" => "401, unauthorized, token not recognized"), 401);
            
            }
        
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            // Le token est expiré
            \Log::info("401, unauthorized, token expired");
            return response()->json(array("error" => "401, unauthorized, token expired"), 401);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            // Le token n'est pas reconnu
              \Log::info("401, unauthorized, token not recognized");
              return response()->json(array("error" => "401, unauthorized, token not recognized"), 401);

        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {

            // Absence du header Authorization
            \Log::info("401, unauthorized, token not provided");
            return response()->json(array("error" => "401, unauthorized, token not provided"), 401);
        
        }

        // if($request->header("Authorization")) {

            // Récupère du token
            // $token = $request->header("Authorization");

            // Authenticate the user based on the token
            // Portail::authenticateUser($request);
            // $payload = JWTAuth::parseToken()->getPayload();

            // Portail::authenticateUser($payload);

            // if (Portail::isAuthenticated($request)) {
            
            //     return $next($request);
            
            // } else {
             
            //     return response()->json(array("error" => "401, unauthorized, token not recognized"), 401);
            
            // }
        
        // } else {
       
        //     // Absence du header Authorization
        //     return response()->json(array("error" => "401, unauthorized, token not provided"), 401);

        // }
    }
}
