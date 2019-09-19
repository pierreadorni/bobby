<?php

namespace App\Libraries;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;

class MailSender extends Model
{

	public function send_new_booking($bookinglines, $comment, $assoRequested, $assoRequesting)
    {
        //On récupère le contenu du mail, le sujet et le destinataire
        $content = "Une nouvelle demande de réservation vous a été adressée par l'association ".$assoRequesting["shortname"];
        $subject = "Bobby - Demande de réservation de matériel";
        $bookinglines = $bookinglines;
        $comment = $comment;
        $receiver = $assoRequested["login"]."@assos.utc.fr";

        Mail::send('mail',['content' => $content, 'bookinglines' => $bookinglines, 'comment' => $comment], function($message) use ($subject) {
            $message->to('josselin.pennors@hotmail.fr');
            $message->from('gestionfablab@gmail.com');
            $message->subject($subject);
        });
    }

    public function confirm_new_booking($bookinglines, $assoRequested, $assoRequesting)
    {
        $content = "Nous vous confirmons votre demande de réversation à l'association ".$assoRequested["shortname"].".\n Votre demande est en cours,
        vous recevrez un mail lorsque l'association répondra à votre demande.";
        $subject = "Bobby - Confirmation de demande de réservation de matériel";
        $receiver = $assoRequesting["login"]."@assos.utc.fr";

        Mail::send('mail',['content' => $content, 'bookinglines' => $bookinglines, 'comment' => null], function($message) use ($subject) {
            $message->to('josselin.pennors@hotmail.fr');
            $message->from('gestionfablab@gmail.com');
            $message->subject($subject);
        });
    }


    public function change_booking_status()
    {

    }

}

