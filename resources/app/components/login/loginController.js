app.controller('loginCtrl', function($scope, $location, $rootScope, $routeParams, Data, PortailAuth, serviceAjax) {


  $scope.message = "Connexion";

	
	//Url avec token?=
	if($routeParams.token){
		$rootScope.auth.login($routeParams.token)
		serviceAjax.get('userassos').then(function(res){
			Data.setUserAssos(res.data);
			serviceAjax.get('associations').then(function(res){
				Data.setAssociations(res.data);
				serviceAjax.get('itemplaces').then(function(res){
					Data.setItemPlaces(res.data);
					serviceAjax.get('itemtypes').then(function(res){
						Data.setItemTypes(res.data);
						$location.path("/");
						$location.url($location.path());  // Clear des paramètres
					})
				})
			})
		})
		
	}
	else if ($routeParams.error && $routeParams.error == 401) { // Si l'utilisateur CAS n'est pas autorisé à accéder

	    $scope.message = "Erreur de connexion";

	    // On redirige vers la page d'erreur 401
	    $location.path("/error/401");
	    $location.url($location.path());  // Clear des paramètres

	}

	else {
	  	PortailAuth.goLogin();
	}
});
