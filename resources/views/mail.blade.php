<html>
	<head>		
	</head>
	<body>
		<p>Bonjour,</p>
		<br>
		<p>{{$content}}</p>
		<br>
		@if($bookinglines)
			<table>
				<tr>
					<th>Nom</th>
					<th>Quantité</th>
					<th>Date d'emprunt</th>
					<th>Date de retour</th>
					<th>Caution</th>
				</tr>
			
				@foreach($bookinglines as $bookingline)
					<tr>
						<td>{{$bookingline['original']['item']['name']}}</td>
						<td>{{$bookingline['original']['status']}}</td>
						<td>{{date('d/m/Y', strtotime($bookingline['original']['startDate']))}}</td>
						<td>{{date('d/m/Y', strtotime($bookingline['original']['endDate']))}}</td>
						<td>{{$bookingline['original']['item']['caution']}}</td>
					</tr>
				@endforeach
			</table>
			<br>
		@endif
		@if($comment)
			<p>L'association a laissé un commentaire : <br>"{{$comment}}"</p>
			<br>
			<h4>Comment procéder?</h4>
			<p>La réservation est disponible dans vos réservations à l'adresse suivant  : <a href="http://localhost:8000/my_bookings">assos.utc.fr/bobby/my_bookings</a>.<br>
				En cliquant sur "Consulter", vous avez la possibilité de valider tous les items qui vous sont demandés, de les refuser ou d'éditer les paramètres tels que les dates d'emprunt et d'ajout ainsi que les quantités. Si vous acceptez cette demande vous devrez communiquer la caution totale à l'association {{$association}}, cette dernière ne leur ayant pas été communiquée.
				<br>Vous avez également la possibilité sur cette même page d'envoyer un mail à l'association ou directement grâce à cette adresse : bdeutc@fffff.fr.</p>
			<br>
		@endif
		<p>Ceci est un mail automatique généré depuis la plateforme <a href="http://localhost:8000/">assos.utc.fr</a> visant à favoriser le partage de matériel entre les associations.</p>
		<p>Pour toute question, veuillez contacter directement le BDE-UTC à l'adresse suivant:
			<a href="mailto:bdeutc@assos.utc.fr">bdeutc@assos.utc.fr</a>.
		</p>
		<br>
		<p>Associativement votre,</p>
		<br>
		<p>L'équipe du BDE</p>
	</body>
</html>