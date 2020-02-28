<?php

namespace App\Http\Controllers;

use App\Log;
use Illuminate\Http\Request;
use Portail;

class LogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Portail::isAdmin();
        
        // Date formate Y-m-d
        $logs = Log::where('created_date', $request->date)->get();
        return response()->json($logs, 200);
    }

}
