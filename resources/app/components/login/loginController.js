app.controller('loginCtrl', function($scope, $location, $rootScope, $routeParams, $http, PortailAuth, serviceAjax) {


  $scope.message = "Connexion";


	/*if($routeParams.code){
  		console.log("ok");
  		$scope.request={};
  		$scope.request.code = $routeParams.code;
  		$http.post('http://localhost:8000/api/v1/login', $scope.request).then(function(data){
	  	console.log(data)
	  })
	}*/
	
	if($routeParams.token){
		$rootScope.auth.login($routeParams.token)
		//.then(function(){
			serviceAjax.get('user').then(function(data){
			console.log(data)
			$location.path("/");
			$location.url($location.path());  // Clear des paramètres
		})
	//})
		// On redirige vers la page main
		/*serviceAjaxPortail.get("user").then(function(data){
			console.log(data);
		})*/
		/*$http.get('https://portail.nastuzzi.fr/api/v1/user').then(function(data){
			console.log(data);
		})*/
		/*serviceAjax.get("user").then(function(data){
			console.log(data)
		})*/
		
		
	}

	else {
	  	serviceAjax.get('code').then(function(data){
		  	console.log(data)
		   	window.location.href = data.data["url"];
		})
	}
});
