app.controller('loginCtrl', function($scope, $location, $rootScope, $routeParams, serviceAjax, $http) {


  $scope.message = "Connexion";

  $http.get('http://localhost:8000/api/v1/login').then(function(data){
   window.location.href = data.data['url'];
  })
});
