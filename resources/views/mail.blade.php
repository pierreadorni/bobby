<html>
	<head>		
	</head>
	<body>
		<p>Bonjour,</p>
		<p>{{$content}}</p>
		@if($bookinglines)
			<table>
				<tr>
					<th>Nom</th>
					<th>Quantité</th>
					<th>Date d'emprunt</th>
					<th>Date de retour</th>
				</tr>
			
				@foreach($bookinglines as $bookingline)
					<tr>
						<td>{{$bookingline['name']}}</td>
						<td>{{$bookingline['quantity']}}</td>
						<td>{{date('d/m/Y', strtotime($bookingline['startDate']))}}</td>
						<td>{{date('d/m/Y', strtotime($bookingline['endDate']))}}</td>
					</tr>
				@endforeach
			</table>
			<br>
		@endif
		@if($comment)
			<p>L'association a laissé un commentaire : <br>"{{$comment}}"</p>
			<h4>Comment procéder?</h4>
		@endif
			<p>La réservation est disponible dans vos réservations à l'adresse suivant  : 
				<a href="https://assos.utc.fr/#/mybookings">assos.utc.fr/bobby/my_bookings</a>.
			</p>
		@if($comment)
	        <p>
				En cliquant sur "Consulter", vous avez la possibilité de valider tous les items qui vous sont demandés, de les 
				refuser ou d'éditer les paramètres tels que les dates d'emprunt et de rendu ainsi que les quantités. Si vous acceptez 
				cette demande la caution totale sera communiquée à l'association.
			</p>
			<br>
		@endif
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