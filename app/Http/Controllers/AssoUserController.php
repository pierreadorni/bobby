<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\AssoUser;
use App\Http\Requests\AssoUserRequest;



class AssoUserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $asso_users = AssoUser::get();
        return response()->json($asso_users, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AssoUserRequest $request)
    {
        $asso_user = AssoUser::create($request->all());
        if($asso_user)
        {
            return response()->json($asso_user, 200);
        }
        else
        {
            return response()->json(["message" => "Impossible de créer l'objet"], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $asso_user = AssoUser::find($id);
        if($asso_user)
            return response()->json($asso_user, 200);
        else
            return response()->json(["message" => "Impossible de trouver l'objet"], 500);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(AssoUserRequest $request, $id)
    {
        $asso_user = AssoUser::find($id);
        if($asso_user){
            $value = $asso_user->update($request->input());
            if($value)
                return response()->json($value, 201);
            return response()->json(['message'=>'An error ocured'],500);
        }
        return response()->json(["message" => "Impossible de trouver l'objet"], 500);    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $asso_user = AssoUser::find($id);
        if ($asso_user)
        {
            $asso_user->delete();
            return response()->json([], 200);
        }
        else
            return response()->json(["message" => "Impossible de trouver l'objet"], 500);
    }
}
