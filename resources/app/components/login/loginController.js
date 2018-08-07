app.controller('loginCtrl', function($scope, $location, $rootScope, $routeParams, serviceAjax, $http) {


  $scope.message = "Connexion";


  /*serviceAjax.get('authorization_code').then(function(data){
    console.log(data);
  })*/
  /*console.log("her");
  $http.get('http://localhost:8000/api/v1/authorization_code').then(function(data){
    console.log(data);
  })*/

  $location.url('https://portail.nastuzzi.fr/oauth/authorize?client_id=4&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Flogin&response_type=code&scope=');
  /*$scope.message = "Connexion";

  if($routeParams.token) { // Si l'on a un token en paramètre (/login?token=)

    // On enregistre ce token dans la factory
    $rootScope.auth.login($routeParams.token)
    .then(function(data){

      // On redirige vers la page main
      $location.path("/");
      $location.url($location.path());  // Clear des paramètres

    }, function(error){

      // Erreur pour récupérer le membre malgré le succès au CAS, erreur 500
      $location.path("/error/500");
      $location.url($location.path()); // Clear des paramètres

    });

  }
  else if ($routeParams.error && $routeParams.error == 401) { // Si l'utilisateur CAS n'est pas autorisé à accéder

    $scope.message = "Erreur de connexion";

    // On redirige vers la page d'erreur 401
    $location.path("/error/401");
    $location.url($location.path());  // Clear des paramètres

  }
  else {

    $scope.message = "Redirection vers le CAS";

    // Si l'on a pas de token, c'est que l'on a pas encore été vers le login CAS.
    // On redirige vers le processus d'authentification grâce à la méthode goLogin() de la factory
    $rootScope.auth.goLogin();

    if($routeParams.token){
      console.log("aaaaaa");
    }

  }*/

});
