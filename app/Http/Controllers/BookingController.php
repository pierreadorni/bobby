<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\BookingRequest;
use App\Http\Controllers\Controller;
use App\Booking;
use App\User;
use App\Association;
use App\Item;
use App\BookingLine;
use Portail;
use MailSender;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Portail::isAdmin();

        $bookings = Booking::all();

        if($bookings){
            foreach ($bookings as $booking) {

                $booking->booker = Portail::showAsso($booking->booker);
                $booking->owner = Portail::showAsso($booking->owner);

                /*Requêtes pour les utilisateurs à changer avec Portail des assos*/
                $booking->user = User::find($booking->user);

                /*Gestion des réceptions de caution*/
                if($booking->cautionReceived)
                    $booking->cautionReceived = "Oui";
                else
                    $booking->cautionReceived = "Non";

                /*Gestion des status*/
                switch ($booking->status) {
                    case '1':
                        $booking->statusName = "En cours";
                        break;

                    case '2':
                        $booking->statusName = "Validée";
                        break;

                    case '1':
                        $booking->statusName = "Terminée";
                        break;

                    case '1':
                        $booking->statusName = "Annulée";
                        break;
                    
                    default:
                        $booking->statusName = "";
                        break;
                }
            }

            return response()->json($bookings, 200);
        }
        else{
            return response()->json(["message" => "Impossible de trouver les réservations"], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(BookingRequest $request)
    {

        Portail::hasAssociationAdminPermission($request->booker);

        try {
            
            Portail::assoExists($request->booker);
            Portail::assoExists($request->owner);

            // Retrieve caution from items
            $caution = 0;
            foreach ($request->bookingline["items"] as $item) {
                $caution += Item::find($item['id'])->caution*$item['quantity'];
            }
            
            $booking = Booking::create(array_merge($request->all(), ['caution' => $caution]));

            if($booking)
            {
                // Bookingline creation
                foreach ($request->bookingline["items"] as $bookingline) {
                    $bookingline["booking"] = $booking->id;
                    BookingLine::create($bookingline);
                }

                MailSender::send_new_booking($request->bookingline["items"], $request->comment, $request->assoRequested, $request->assoRequesting);
                MailSender::confirm_new_booking($request->bookingline["items"], $request->assoRequested, $request->assoRequesting);
  
                return response()->json($booking, 200);
            }
            else
            {
                return response()->json(["message" => "Impossible de créer la réservation"], 500);
            }

        } catch (\Throwable $th) {
            return response()->json(["message" => "Une erreur est survenue."], 500);
        }

            
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Booking  $booking
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $booking = Booking::with('bookinglines')->get()->find($id); 

        Portail::hasInAssociationsAdminPermissionOrAdmin($booking->owner, $booking->booker);

        if($booking){
            //Récupération des informations liées à la réservation
            foreach ($booking->bookinglines as $bookingline) {
                $bookingline->item = [
                    'name' => Item::withTrashed()->get()->find($bookingline->item)->name
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

                $bookingline->edit = false;

            }

            /*Requêtes pour les associations à changer avec Portail des assos*/
            $booking->owner = Portail::showAsso($booking->owner);
            $booking->booker = Portail::showAsso($booking->booker);

            /*Requêtes pour les utilisateurs à changer avec Portail des assos*/
            $booking->user = User::find($booking->user);

            /*Gestion des réceptions de caution*/
                if($booking->cautionReceived)
                    $booking->cautionReceived = "Oui";
                else
                    $booking->cautionReceived = "Non";

                /*Gestion des status*/
                switch ($booking->status) {
                    case '1':
                        $booking->statusName = "En cours";
                        break;

                    case '2':
                        $booking->statusName = "Validée";
                        break;

                    case '3':
                        $booking->statusName = "Terminée";
                        break;

                    case '4':
                        $booking->statusName = "Annulée";
                        break;
                    
                    default:
                        $booking->statusName = "";
                        break;
                }

            return response()->json($booking, 200);
        }
        else
            return response()->json(["message" => "Impossible de trouver la réservation"], 500);
    }



    /**
     * Méthode pour valider la réception de la caution
     */
    public function cautionReceived(Request $request, $id)
    {
        $booking  = Booking::find($id);

        Portail::hasAssociationAdminPermission($booking->owner);

        if ($booking) {
            $booking->cautionReceived = true;

            MailSender::generic_mail("Bobby - Demande de matériel n°".$booking->id, "L'association a indiqué que vous aviez bien remis la caution.", $request->assoRequesting['shortname']."@assos.utc.fr"); 
            MailSender::generic_mail("Bobby - Demande de matériel n°".$booking->id, "Nous vous confirmons que vous avez indiqué avoir reçu la caution.", $request->assoRequested['shortname']."@assos.utc.fr"); 

            $booking->save();

            return response()->json($booking, 201);
        } 
        return response()->json(["message" => "Impossible de trouver la réservation"], 500);
    }


    /**
     * Index des commandes pour une association
     */
    public function indexAssociation(Request $request, $asso_id){

        Portail::hasAssociationAdminPermission($asso_id);

        // Get date 6 month ago
        $date = date("Y-m-d", mktime(0, 0, 0, date("m")-6, date("d"),   date("Y")));

        // Retrieve all bookings that are no more than 6 months old
        $bookings = [
            /* Réservation où l'association est propriétaire */
            "ownerBookings"     =>  Booking::whereDate('created_at', '>=', $date.' 00:00:00')->where('owner', $asso_id)->with('bookinglines')->get(),
            /* Réservation demandée par l'association */
            "bookerBookings"    =>  Booking::whereDate('created_at', '>=', $date.' 00:00:00')->where('booker', $asso_id)->get(),
        ];

        if($bookings['ownerBookings']){
            foreach ($bookings['ownerBookings'] as $booking) {

                $booking->booker = Portail::showAsso($booking->booker);

                $booking->user = User::find($booking->user);

                /*Gestion des réceptions de caution*/
                if($booking->cautionReceived)
                    $booking->cautionReceived = "Oui";
                else
                    $booking->cautionReceived = "Non";
            }

            // Recherche des items en cours d'emprunt ou à venir
            $owner_bookings = $bookings['ownerBookings'];
            $bookinglines = [];
            foreach ($owner_bookings as $booking) {
                foreach ($booking->bookinglines as $bookingline) {
                    if (($bookingline['startDate'] >= date('Y-m-d') || $bookingline['endDate'] >= date('Y-m-d')) && ($bookingline["status"] == 2 || $bookingline["status"] == 3)) {
                        $bookingline["item"] = Item::withTrashed()->find($bookingline["item"]);
                        array_push($bookinglines, $bookingline);
                    }
                } 
            }

            $bookings = array_merge($bookings, ['bookinglines' => $bookinglines]);

        }

        if($bookings['bookerBookings']){
            foreach ($bookings['bookerBookings'] as $booking) {

                $booking->owner = Portail::showAsso($booking->owner);

                /*Requêtes pour les utilisateurs à changer avec Portail des assos*/
                $booking->user = User::find($booking->user);

                /*Gestion des réceptions de caution*/
                if($booking->cautionReceived)
                    $booking->cautionReceived = "Oui";
                else
                    $booking->cautionReceived = "Non";

                /* Retrait de la caution que l'association demandeuse ne doit pas voir */
                $booking->offsetUnset('caution');
            }
            return response()->json($bookings, 200);
        }
        
    }


    /**
     * Fonction pour accepter tous les items d'une commande
     */
    public function acceptBooking(Request $request, $id)
    {

        try {
            $booking  = Booking::where('id', $id)->with('bookinglines')->get()->first();

            Portail::hasAssociationAdminPermission($booking->owner);

            if ($booking->status == 1) {
                $booking->status = 2;
            }

            foreach ($booking->bookinglines as $bookingline) {
                if ($bookingline-> status == 1) {
                    $bookingline->status = 2;
                    $bookingline->save();
                }
                $bookingline = $this->getBookinglineInformation($bookingline);
            }

            MailSender::change_booking_status(True, True, True, $request->assoRequested, $request->assoRequesting, $booking->bookinglines, $booking->id, $booking->caution);
            MailSender::change_booking_status(False, False, False, $request->assoRequested, $request->assoRequesting, $booking->bookinglines, $booking->id, null);

            $booking->save();

            return response()->json([], 201);

        } catch (\Throwable $th) {
            return response()->json(['message'=>'Une erreur s\'est produite.'],500);
        }
    }


    /**
     * Fonction pour refuser tous les items d'une commande
     */
    public function cancelBooking(Request $request, $id)
    {

        try {
            $booking  = Booking::where('id', $id)->with('bookinglines')->get()->first();

            Portail::hasInAssociationsAdminPermission($booking->owner, $booking->booker);

            $booking->status = 4;

            foreach ($booking->bookinglines as $bookingline) {
                if ($bookingline->status < 3) {
                    $bookingline->status = 4;
                    $bookingline->save();
                } else {
                    $booking->status = 3;
                }
                $bookingline = $this->getBookinglineInformation($bookingline);
            }

            $assoOwnerDidUpdate = false;
            if (Portail::isUserAdminAsso($booking->owner)) {
                $assoOwnerDidUpdate = true;
            }

            MailSender::change_booking_status($assoOwnerDidUpdate, False, True, $request->assoRequested, $request->assoRequesting, $booking->bookinglines, $booking->id, null);
            MailSender::change_booking_status($assoOwnerDidUpdate, False, False, $request->assoRequested, $request->assoRequesting, $booking->bookinglines, $booking->id, null);

            $booking->save();

            return response()->json([], 201);

        } catch (\Throwable $th) {
            return response()->json(['message'=>'Une erreur s\'est produite.'],500);
        }
    }


    /**
     * Fonction pour noter tous les items d'une commande comme rendu
     */
    public function returnedBooking(Request $request, $id)
    {

        try {
            $booking  = Booking::where('id', $id)->with('bookinglines')->get()->first();

            Portail::hasAssociationAdminPermission($booking->owner);
            
            if ($booking->status == 2) {
                $booking->status = 3;
            }
            $booking->save();

            foreach ($booking->bookinglines as $bookingline) {
                if ($bookingline-> status == 2) {
                    $bookingline->status = 3;
                    $bookingline->save();
                }
            }

            MailSender::generic_mail("Bobby - Demande de matériel n°".$booking->id, "L'association a indiqué vous aviez bien rendu le matériel.", $request->assoRequesting['shortname']."@assos.utc.fr"); 
            MailSender::generic_mail("Bobby - Demande de matériel n°".$booking->id, "Nous vous confirmons que vous avez indiqué avoir reçu votre matériel.", $request->assoRequesting['shortname']."@assos.utc.fr"); 

            return response()->json([], 201);

        } catch (\Throwable $th) {
            return response()->json(['message'=>'Une erreur s\'est produite.'],500);
        }
    }

    protected function getBookinglineInformation($bookingline){

        $bookingline->item = [
            'name' => Item::withTrashed()->get()->find($bookingline->item)->name
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
