<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function send(Request $request)
    {
        //On récupère le contenu du mail, le sujet et le destinataire
        $content = $request->content;
        $subject = $request->subject;
        $bookinglines = $request->bookinglines;
        $comment = $request->comment;
        $association = $request->association;


        //dd(json($bookinglines));
        //$receiver = $request->receiver;
        $receiver = "josselin.pennors@hotmail.fr";

        /*$content = "cc";
        $subject = "cc";
        $receiver = "josselin.pennors@hotmail.fr";*/

        //dd($request);


        //On envoie l'email depuis la boîte mail bde-logistique
        Mail::send('mail',['content' => $content, 'bookinglines' => $bookinglines, 'comment' => $comment, 'association' => $association], function($message) use ($subject) {
            $message->to('josselin.pennors@hotmail.fr');
            $message->from('gestionfablab@gmail.com');
            $message->subject($subject);
        });
    }
}
