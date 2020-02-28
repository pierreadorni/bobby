<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests\ItemRequest;
use App\Http\Controllers\Controller;
use App\Item;
use Portail;
use App\Exports\ItemsExport;
use App\ItemPlace;
use App\ItemType;
use Maatwebsite\Excel\Facades\Excel;


class ItemController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Portail::isAdmin();

        $items = Item::with(['place', 'type'])->get();

        foreach ($items as $item) {
            $item->association = Portail::showAsso($item->association_id);
        }

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
        Portail::hasAssociationAdminPermission($request->association_id);

        $item = Item::onlyTrashed()->updateOrCreate(
            [
                'name'              => $request->name,
                'association_id'    => $request->association_id
            ],
            [
                'quantity'          => $request->quantity,
                'place_id'          => $request->place_id,
                'type_id'           => $request->type_id,
                'status'            => $request->status,
                'caution'           => $request->caution
            ]
        );

        if ($item->deleted_at) {
            $item->restore();
        }

        if($item)
        {
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

    public function show(Request $request, $id)
    {
        $item = Item::with(['place', 'type'])->get()->find($id);

        Portail::hasAssociationAdminPermission($item->association_id);

        if($item){

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
            return response()->json($item, 200);
        }           
        else{
            return response()->json(["message" => "Impossible de trouver l'objet"], 500);
        }
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
     
        Portail::hasAssociationAdminPermission($item->association_id);

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

        Portail::hasAssociationAdminPermission($item->association_id);


        if ($item)
        {
            $item->delete();
            return response()->json([], 200);
        }
        else
            return response()->json(["message" => "Impossible de trouver l'objet"], 500);
    }
    

    /**
     * Items d'une catégorie
     */
    public function itemFromCategorie(Request $request, $categorie)
    {
        $items = Item::where('status', '<', 3)
            ->with('type')        
            ->select('id', 'name', 'quantity', 'association_id', 'type_id', 'status')
            ->get();
        if($categorie>0){
            $items = $items->where('type_id', $categorie);
        }
        foreach ($items as $item) {
            $item->association = Portail::showAsso($item->association_id);
        }
        return $items;
    }

    /**
     * Items d'une association
     */
    public function itemFromAssociation(Request $request, $uid)
    {

        Portail::isAssociationMember($uid);

        $items = Item::where('association_id', $uid)->with(['place', 'type'])->get();
        foreach ($items as $item) {
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

    public function exportItem(Request $request, $asso_id){
        Portail::hasAssociationAdminPermission($asso_id);
        return Excel::download(new ItemsExport($asso_id), 'data.xlsx');
    }


    public function importItem(Request $request, $asso_id){
        Portail::hasAssociationAdminPermission($asso_id);

        # To DO , vérification ?

        # Suppression des items existants
        $items = Item::where('association_id', $asso_id)->get();
        foreach ($items as $item) {
            $item->delete();
        }

        # Récupération des localisation et des catégories
        $item_places = ItemPlace::all();
        $item_types = ItemType::all();

        # Normalisation des localisations et ds catégories
        foreach ($item_places as $item_place) {
            $item_place->normalized_name = ItemPlace::normalize_place($item_place->name);
        }
        foreach ($item_types as $item_type) {
            $item_type->normalized_name = ItemType::normalize_type($item_type->name);
        }

        # Ajout des nouveaux items ou update avec restore si le nom existe déjà
        foreach ($request->items as $item) {

            # Récupération des données manquantes avant création
            $item['type_id'] = $item_types->where('normalized_name', $item['typeName'])->first()->id;
            $item['place_id'] = $item_places->where('normalized_name', $item['placeName'])->first()->id;

            $item = Item::withTrashed()->updateOrCreate(
                [
                    'name'              => $item['name'],
                    'association_id'    => $asso_id,
                ],
                [
                    'quantity'          => $item['quantity'],
                    'place_id'          => $item['place_id'],
                    'type_id'           => $item['type_id'],
                    'status'            => $item['status'],
                    'caution'           => $item['caution']
                ]
            );
    
            if ($item->deleted_at) {
                $item->restore();
            }

        }
        return response()->json();
    }
}