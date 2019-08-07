app.controller('logoutCtrl', function($scope, PortailAuth) {


    $scope.message = "Déconnexion";
  
    PortailAuth.goLogout();
    
});
  