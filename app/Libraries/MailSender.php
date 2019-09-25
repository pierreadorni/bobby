<?php

namespace App\Libraries;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;

class MailSender
{

	public function send_new_booking($bookinglines, $comment, $assoRequested, $assoRequesting)
    {
        //On récupère le contenu du mail, le sujet et le destinataire
        $content = "Une nouvelle demande de réservation vous a été adressée par l'association ".$assoRequesting["shortname"];
        $subject = "[Bobby] Demande de réservation de matériel";
        $bookinglines = $bookinglines;
        $comment = $comment;
        $receiver = $assoRequested["login"]."@assos.utc.fr";
        if (env('APP_ENV') == 'local') {
            $receiver = env('PERSONAL_ADDRESS');
        }

        Mail::send('mail',['content' => $content, 'bookinglines' => $bookinglines, 'comment' => $comment], function($message) use ($subject, $receiver) {
            $message->to($receiver);
            $message->from(env('MAIL_ADDRESS'));
            $message->subject($subject);
        });
    }

    public function confirm_new_booking($bookinglines, $assoRequested, $assoRequesting)
    {
        $content = "Nous vous confirmons votre demande de réversation à l'association ".$assoRequested["shortname"].".\n Votre demande est en cours,
        vous recevrez un mail lorsque l'association répondra à votre demande.";
        $subject = "[Bobby] Confirmation de demande de réservation de matériel";
        $receiver = $assoRequesting["login"]."@assos.utc.fr";
        if (env('APP_ENV') == 'local') {
            $receiver = env('PERSONAL_ADDRESS');
        }

        Mail::send('mail',['content' => $content, 'bookinglines' => $bookinglines, 'comment' => null], function($message) use ($subject, $receiver) {
            $message->to($receiver);
            $message->from(env('MAIL_ADDRESS'));
            $message->subject($subject);
        });
    }

    public function change_booking_status($didUpdate, $canAnnounceCaution, $isAssoReceiverRequested, $assoRequested, $assoRequesting, $bookinglines, $bookingId, $caution=null)
    {
        $content = "La commande n°".$bookingId." a été modifiée par l'association.";
        if ($didUpdate) {
            $content = "Nous vous confirmons que vous avez modifié la commande n°".$bookingId.".";
        }

        $receiver = $assoRequesting["login"]."@assos.utc.fr";

        if (env('APP_ENV') == 'local') {
            $receiver = env('PERSONAL_ADDRESS');
        }

        if ($isAssoReceiverRequested) {
            $assoRequested["login"]."@assos.utc.fr";
        }
        $subject = "[Bobby] Demande de matériel n°".$bookingId;

        Mail::send('mail_booking_edit',['content' => $content, 'bookinglines' => $bookinglines, 'canAnnounceCaution' => $canAnnounceCaution, 'caution' => $caution], function($message) use ($subject, $receiver) {
            $message->to($receiver);
            $message->from(env('MAIL_ADDRESS'));
            $message->subject($subject);
        });
    }

    public function generic_mail($subject, $content, $receiver){
        
        if (env('APP_ENV') == 'local') {
            $receiver = env('PERSONAL_ADDRESS');
        }

        Mail::send('generic_mail',['content' => $content], function($message) use ($subject, $receiver) {
            $message->to($receiver);
            $message->from(env('MAIL_ADDRESS'));
            $message->subject($subject);
        });
    }

}

