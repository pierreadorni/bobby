<html>
	<head>		
	</head>
	<body>
		<p>Bonjour,</p>
        <p>{{$content}}</p>
        <p>Voici les items de la demande et leur statut : </p>
        @if($bookinglines)
            <ul>
                @foreach($bookinglines as $bookingline)
                    <li>
                        {{$bookingline['item']['name']}} - Quantité: {{$bookingline['quantity']}} - Du {{date('d/m/Y', strtotime($bookingline['startDate']))}} au {{date('d/m/Y', strtotime($bookingline['endDate']))}} - <strong>Statut</strong> {{$bookingline['statusName']}}
                        <br>
                        @if($bookingline['status'] == 2)
                            Caution : {{$bookingline['item']['caution']}}€
                        @endif
                    </li>
                @endforeach
            </ul>
			<br>
        @endif
        <p>
            Les statuts possibles sont les suivants : 
            <ul>
                <li><strong>En cours</strong> : Signifie que l'item doit encore être validé.</li>
                <li><strong>Validé</strong> : L'association a validé le prêt de l'item et ainsi vous pouvez le récupérer aux dates convenues.</li>
                <li><strong>Rendu</strong> : Le prêt est terminé.</li>
                <li><strong>Annulé</strong> : Le prêt a été annulé.</li>
            </ul>
        </p>
		@if($canAnnounceCaution)
			<p><strong>La caution à régler est de {{$caution}}€. Vous devez impérativement la fournir à l'association vous prêtant son matériel.</strong></p>
		@endif
        <p>La réservation est disponible dans vos réservations à l'adresse suivant  : 
            <a href="https://assos.utc.fr/bobby/#!/mybookings">assos.utc.fr/bobby/my_bookings</a>.
        </p>
		<p>Ceci est un mail automatique généré depuis la plateforme <a href="https://assos.utc.fr/bobby">assos.utc.fr/bobby</a> 
			visant à favoriser le partage de matériel entre les associations.</p>
		<p>Pour toute question, veuillez contacter directement le Simde à l'adresse suivant:
			<a href="mailto:simde@assos.utc.fr">simde@assos.utc.fr</a>.
		</p>
		<br>
		<p>Associativement votre,</p>
		<br>
		<p>L'équipe du BDE et du Simde</p>
	</body>
</html>