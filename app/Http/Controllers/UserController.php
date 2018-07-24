<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use App\Http\Controllers\Controller;
use App\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::get();
        return response()->json($users, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserRequest $request)
    {
        //dd($request->login);
        $user = User::create($request->all());
        if($user)
        {
            return response()->json($user, 200);
        }
        else
        {
            return response()->json(["message" => "Impossible de créer l'utilisateur"], 500);
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
        $user = User::find($id);
        if($user)
            return response()->json($user, 200);
        else
            return response()->json(["message" => "Impossible de trouver l'utilisateur"], 500);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UserRequest $request, $id)
    {
        $user = User::find($id);
        if($user){
            $value = $user->update($request->input());
            if($value)
                return response()->json($value, 201);
            return response()->json(['message'=>'An error ocured'],500);
        }
        return response()->json(["message" => "Impossible de trouver l'utilisateur"], 500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::find($id);
        if ($user)
        {
            $user->delete();
            return response()->json([], 200);
        }
        else
            return response()->json(["message" => "Impossible de trouver l'utilisation"], 500);
    }
}
