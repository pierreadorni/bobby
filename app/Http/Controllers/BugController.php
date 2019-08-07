<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Portail;
use App\Bug;

class BugController extends Controller
{

    public function index(Request $request)
    {
        Portail::isAdmin();

        $bugs = Bug::all();
        return response()->json($bugs, 200);
    }


    public function store(Request $request)
    {
        $bug = Bug::create($request->all());
        if ($bug) {
            return response()->json([], 201);
        }
        return response()->json(["message" => "Impossible de créer l'objet"], 500);
    }


    public function destroy(Request $request, $id)
    {
        Portail::isAdmin();

        $bug = Bug::findOrFail($id);

        try {
        
            $bug->delete();
            return response()->json([], 200);
        
        } catch (\Throwable $th) {
            return response()->json(["message" => "Impossible de supprimer l'objet"], 500);
        }
    }
}
