app.controller('loginCtrl', function($scope, $location, $rootScope, $routeParams, $http, PortailAuth, serviceAjax) {


  $scope.message = "Connexion";
	
	//Url avec token?=
	if($routeParams.token){
		$rootScope.auth.login($routeParams.token)
		//.then(function(){
			serviceAjax.get('user').then(function(data){
			$location.path("/");
			$location.url($location.path());  // Clear des paramètres
		})
	}

	else {
	  	PortailAuth.goLogin();
	}
});
