<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\AssociationRequest;
use App\Http\Controllers\Controller;
use App\Association;

class AssociationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $associations = Association::get();
        return response()->json($associations, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AssociationRequest $request)
    {
        $association = Association::create($request->all());
        if($association)
        {
            return response()->json($association, 200);
        }
        else
        {
            return response()->json(["message" => "Impossible de créer l'association"], 500);
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
        $association = Association::find($id);

        if($association)
            return response()->json($association, 200);
        else
            return response()->json(["message" => "Impossible de trouver l'association"], 500);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(AssociationRequest $request, $id)
    {
        $association = Association::find($id);
        if($association){
            $value = $association->update($request->input());
            if($value)
                return response()->json($value, 201);
            return response()->json(['message'=>'An error ocured'],500);
        }
        return response()->json(["message" => "Impossible de trouver l'association"], 500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
       $association = Association::find($id);

        if ($association)
        {
            $association->delete();
            return response()->json([], 200);
        }
        else
            return response()->json(["message" => "Impossible de trouver l'association"], 500);
    }
}
