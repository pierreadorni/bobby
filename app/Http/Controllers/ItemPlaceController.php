<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ItemPlaceRequest;

use App\Http\Controllers\Controller;
use App\ItemPlace;

class ItemPlaceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $item_places = ItemPlace::get();
        return response()->json($item_places, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ItemPlaceRequest $request)
    {
        $item_place = ItemPlace::create($request->all());
        if($item_place)
        {
            return response()->json($item_place, 200);
        }
        else
        {
            return response()->json(["message" => "Impossible de créer la localisation"], 500);
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
        $item_place = ItemPlace::find($id);
        if($item_place)
            return response()->json($item_place, 200);
        else
            return response()->json(["message" => "Impossible de trouver la localisation"], 500);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ItemPlaceRequest $request, $id)
    {
        $item_place = ItemPlace::find($id);
        if($item_place){
            $value = $item_place->update($request->input());
            if($value)
                return response()->json($value, 201);
            return response()->json(['message'=>'An error ocured'],500);
        }
        return response()->json(["message" => "Impossible de trouver la localisation"], 500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        
        $item_place = ItemPlace::find($id);
        if ($item_place)
        {
            $item_place->delete();
            return response()->json([], 200);
        }
        else
            return response()->json(["message" => "Impossible de trouver la localisation"], 500);
    }
}