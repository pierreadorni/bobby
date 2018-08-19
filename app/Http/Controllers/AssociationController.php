<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Portail;

class AssociationController extends Controller
{
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index (Request $request)
    {
        $assos = Portail::indexAsso($request);
        //dd($assos);

        return response()->json($assos, 200);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $uid)
    {

        $asso = Portail::showAsso($request, $uid);

        return response()->json($asso, 200);
    }

}
