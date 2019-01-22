<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests\ItemRequest;
use App\Http\Controllers\Controller;
use App\Item;
use Portail;
use App\Exports\ItemsExport;
use Maatwebsite\Excel\Facades\Excel;


class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $items = Item::get();
        return response()->json($items, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(ItemRequest $request)
    {
        $item = Item::create($request->all());
        if($item)
        {
            return response()->json($item, 200);
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
        $item = Item::find($id);
        if($item)
            return response()->json($item, 200);
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

    public function update(ItemRequest $request, $id)
    {
        $item = Item::find($id);
        //dd($item);
        if($item){
            $value = $item->update($request->input());
            if($value)
                return response()->json($value, 201);
            return response()->json(['message'=>'An error ocured'],500);
        }
        return response()->json(["message" => "Impossible de trouver l'objet"], 500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function destroy($id)
    {
        $item = Item::find($id);
        if ($item)
        {
            $item->delete();
            return response()->json([], 200);
        }
        else
            return response()->json(["message" => "Impossible de trouver l'objet"], 500);
    }

    //Quand on clique sur une catégorie
    public function itemFromCategorie(Request $request, $categorie)
    {
        $items = Item::all()->where('status', '<', 3);
        if($categorie>0){
            $items = $items->where('type', $categorie);
        }
        foreach ($items as $item) {
            $item->association = Portail::showAsso($request, $item->association);
            $item->placeName = $item->itemplaces->name;
            $item->typeName = $item->itemtypes->name;
        }
        return $items;
    }

    public function itemFromAssociation(Request $request, $uid)
    {
        $items = Item::all()->where('association', $uid);
        foreach ($items as $item) {
            if($item->type)
                $item->typeName = $item->itemtypes->name;
            if($item->place)
                $item->placeName = $item->itemplaces->name;
            switch ($item->status) {
                case '1':
                    $item->statusName = 'Visible';
                    break;
                case '2':
                    $item->statusName = 'Visible et non empruntable';
                    break;
                case '3':
                    $item->statusName = 'Invisible';
                    break;

                default:
                    $item->statusName = 'Visible';
                    break;
            }
            $item->edit = null;
        }
        return $items;
    }

    public function exportItem(){
        //Excel::download(new DataExport, 'inventaire.xlsx');
        //return Item::all();
        //$ok = (new ItemsExport, 'data.xlsx');
        //dd(Excel::download(new ItemsExport, 'items.xlsx'));
        return Excel::download(new ItemsExport, 'items.xlsx');
    }
}