<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ItemTypeRequest;

use App\Http\Controllers\Controller;
use App\ItemType;

class ItemTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $item_types = ItemType::get();
        return response()->json($item_types, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ItemTypeRequest $request)
    {
        $item_type = ItemType::create($request->all());
        if($item_type)
        {
            return response()->json($item_type, 200);
        }
        else
        {
            return response()->json(["message" => "Impossible de créer le type d'item"], 500);
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
        $item_type = ItemType::find($id);
        if($item_type)
            return response()->json($item_type, 200);
        else
            return response()->json(["message" => "Impossible de trouver le type d'item"], 500);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ItemTypeRequest $request, $id)
    {
        $item_type = ItemType::find($id);
        if($item_type){
            $value = $item_type->update($request->input());
            if($value)
                return response()->json($value, 201);
            return response()->json(['message'=>'An error ocured'],500);
        }
        return response()->json(["message" => "Impossible de trouver le type d'item"], 500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        
        $item_type = ItemType::find($id);
        if ($item_type)
        {
            $item_type->delete();
            return response()->json([], 200);
        }
        else
            return response()->json(["message" => "Impossible de trouver le type d'item"], 500);
    }
}