<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\BookingLineRequest;
use App\Http\Controllers\Controller;
use App\BookingLine;
use App\Booking;
use App\Item;
use Portail;
use MailSender;

class BookingLineController extends Controller
{

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $bookingline = BookingLine::find($id);

        $booking = Booking::find($bookingline->booking);
        Portail::hasInAssociationsAdminPermission($booking->owner, $booking->booker);

        if($bookingline){
            try {
                $bookingline->startDate = $request->startDate;
                $bookingline->endDate = $request->endDate;
                $bookingline->quantity = $request->quantity;
                $bookingline->status = 1;
                $bookingline->save();

                $booking = Booking::where('id', $bookingline->booking)->with('bookinglines')->get()->first();

                foreach ($booking->bookinglines as $bookingline){
                    $bookingline = $this->getBookinglineInformation($bookingline);
                }

                MailSender::change_booking_status(True, False, True, $request->assoRequested, $request->assoRequesting, $booking->bookinglines, $booking->id, null);
                MailSender::change_booking_status(False, False, False, $request->assoRequested, $request->assoRequesting, $booking->bookinglines, $booking->id, null);

                return response()->json($bookingline, 201);
            } catch (\Throwable $th) {
                return response()->json(['message'=>'Une erreur s\'est produite.'],500);
            }
        }
        return response()->json(["message" => "Impossible de trouver l'objet"], 500);
    }


    /**
     * Changer le statut d'un item d'une commande en indiquant qu'il a été accepté
     */
    public function acceptLine(Request $request, $id)
    {
        $bookingline = BookingLine::find($id);

        $booking = Booking::find($bookingline->booking);
        Portail::hasAssociationAdminPermission($booking->owner);

        if($bookingline && $bookingline->status == 1){
            try {
                $bookingline->status = 2;
                $bookingline->save();

                $booking = Booking::where('id', $bookingline->booking)->with('bookinglines')->get()->first();

                // Vérification du statuts des autres items de la commande
                // Si aucun n'a un statut 1
                // Passage de la commande en statut 2

                $res = array_filter(	
                    $booking->bookinglines->toArray(),	
                    function ($b) {	
                        return $b['status'] == 1;	
                    }	
                );

                $announceCaution = false;

                if (empty($res)) {
                    $booking->status = 2;
                    $announceCaution = True;
                }

                foreach ($booking->bookinglines as $bookingline){
                    $bookingline = $this->getBookinglineInformation($bookingline);
                }

                MailSender::change_booking_status(True, False, True, $request->assoRequested, $request->assoRequesting, $booking->bookinglines, $booking->id, null);
                MailSender::change_booking_status(False, $announceCaution, False, $request->assoRequested, $request->assoRequesting, $booking->bookinglines, $booking->id, null);

                $booking->save();

                return response()->json($bookingline, 201);
            } catch (\Throwable $th) {
                dd($th);
                return response()->json(['message'=>'Une erreur s\'est produite.'],500);
            }
        }
        return response()->json(["message" => "Impossible de trouver l'objet"], 500);
    }


    /**
     * Changer le statut d'un item d'une commande en indiquant qu'il a été annulé
     */
    public function cancelLine(Request $request, $id)
    {
        $bookingline = BookingLine::find($id);

        

        $booking = Booking::find($bookingline->booking);

        Portail::hasInAssociationsAdminPermission($booking->owner, $booking->booker);

        if($bookingline && $bookingline->status < 3){
            try {
                $bookingline->status = 4;
                $bookingline->save();

                $booking = Booking::where('id', $bookingline->booking)->with('bookinglines')->get()->first();

                // Vérification du statuts des autres items de la commande
                // Si aucun statut < 4
                // Passage de la commande en statut 4

                $res = array_filter(	
                    $booking->bookinglines->toArray(),	
                    function ($b) {	
                        return $b['status'] < 4;	
                    }	
                );

                if (empty($res)) {
                    $booking->status = 4;
                } else {
                    // On cherche le plus petit statut pour vérifier qu'il est bien comme celui de la commande
                    $min = array_reduce($booking->bookinglines->toArray(), function($min, $line) {
                        return min($min, $line['status']);
                      }, PHP_INT_MAX);
                    
                    $announceCaution = false;
                    if ($booking->status != 2 && $min == 2) {
                        $announceCaution = true;
                    }
                    $booking->status = $min;
                }

                $booking->caution = $booking->caution - $bookingline->caution;

                foreach ($booking->bookinglines as $bookingline){
                    $bookingline = $this->getBookinglineInformation($bookingline);
                }

                $assoOwnerDidUpdate = false;
                if (Portail::isUserAdminAsso($booking->owner)) {
                    $assoOwnerDidUpdate = true;
                }

                $booking->save();

                MailSender::change_booking_status($assoOwnerDidUpdate, False, True, $request->assoRequested, $request->assoRequesting, $booking->bookinglines, $booking->id, null);
                MailSender::change_booking_status(!$assoOwnerDidUpdate, $announceCaution, False, $request->assoRequested, $request->assoRequesting, $booking->bookinglines, $booking->id, null);

                

                return response()->json($bookingline, 201);
            } catch (\Throwable $th) {
                dd($th);
                return response()->json(['message'=>'Une erreur s\'est produite.'],500);
            }
        }
        return response()->json(["message" => "Impossible de trouver l'objet"], 500);
    }


    /**
     * Changer le statut d'un item d'une commande en indiquant qu'il a été retournée
     */
    public function returnedLine(Request $request, $id)
    {
        $bookingline = BookingLine::find($id);

        $booking = Booking::find($bookingline->booking);
        Portail::hasAssociationAdminPermission($booking->owner);

        if($bookingline && $bookingline->status == 2){
            try {
                $bookingline->status = 3;
                $bookingline->save();

                $booking = Booking::where('id', $bookingline->booking)->with('bookinglines')->get()->first();

                // Vérification du statuts des autres items de la commande
                // Si aucun statut < 3
                // Passage de la commande en statut 3

                $res = array_filter(	
                    $booking->bookinglines->toArray(),	
                    function ($b) {	
                        return $b['status'] < 3;	
                    }	
                );

                if (empty($res)) {
                    $booking->status = 3;
                    $booking->save();
                }

                foreach ($booking->bookinglines as $bookingline){               
                    $bookingline = $this->getBookinglineInformation($bookingline);
                }

                MailSender::change_booking_status(True, False, True, $request->assoRequested, $request->assoRequesting, $booking->bookinglines, $booking->id, null);
                MailSender::change_booking_status(False, False, False, $request->assoRequested, $request->assoRequesting, $booking->bookinglines, $booking->id, null);

                return response()->json($bookingline, 201);
            } catch (\Throwable $th) {
                dd($th);
                return response()->json(['message'=>'Une erreur s\'est produite.'],500);
            }
        }
        return response()->json(["message" => "Impossible de trouver l'objet"], 500);
    }


    protected function getBookinglineInformation($bookingline){

        $item = Item::withTrashed()->get()->find($bookingline->item);

        $bookingline->item = [
            'name' => $item->name,
            'caution' => $item->caution
        ];

        /*Gestion des status*/
        switch ($bookingline->status) {
            case '1':
                $bookingline->statusName = "En cours";
                break;

            case '2':
                $bookingline->statusName = "Validé";
                break;

            case '3':
                $bookingline->statusName = "Rendu";
                break;

            case '4':
                $bookingline->statusName = "Annulé";
                break;
            
            default:
                $bookingline->statusName = "";
                break;
        }

        return $bookingline;
    }
    
}