app.controller('loginCtrl', function($scope, $location, $rootScope, $routeParams, $http, PortailAuth, serviceAjax) {


  $scope.message = "Connexion";

	
	//Url avec token?=
	if($routeParams.token){
		$rootScope.auth.login($routeParams.token)
		$location.path("/");
		$location.url($location.path());  // Clear des paramètres
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
