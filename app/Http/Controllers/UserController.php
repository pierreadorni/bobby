<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use App\Http\Controllers\Controller;
use App\User;
use Portail;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getUser(Request $request)
    {
        $user = Portail::getUser();
        return response()->json($user, 200);
    }


    /**
    * Display the associations of a user
    *
    */
    public function userAssociations(Request $request)
    {
        $assos = Portail::getUserAssociations();
        return response()->json($assos, 200);
    }


    /**
    *   Récupérer les permissions d'un utilisateur sur une association
    *
    */
    public function getPermissions(Request $request)
    {

        $permissions = Portail::getPermissions();
        return response()->json($permissions, 200);

    }

}
