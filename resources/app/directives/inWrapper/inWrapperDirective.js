app.directive('inWrapper', function() {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {},
        controller: function() {
        },
        templateUrl: 'app/Directives/inWrapper/in_wrapper.html',
    };
})
.controller('inWrapperCtrl', function($scope, serviceAjax, $http, $rootScope){
	this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    /* Ajout pour gérer l'utilisateur */

    /*$scope.isActive = function($nb){
    	return $rootScope.user == $nb;
    }

    $scope.changeUser = function($nb){
    	$rootScope.user = $nb;
    }*/
    console.log($rootScope.auth);

	var loadItemTypes = function(){
		$scope.loading = true;
		serviceAjax.get("itemtypes").then(function(data){
	    	console.log("Poulet",data.data);

	    	$scope.types=data.data;
		});
		$scope.loading = false;
	}

	loadItemTypes();

	var loadAssociations = function(){
		$scope.loading = true;
		serviceAjax.get("associations").then(function(data){
	    	console.log("Poulet",data.data);

	    	$scope.assos=data.data;

            if($scope.assos.length == 1){
                /* Si l'utilisateur ne fait parti que d'une seule association */
                $scope.singleAssociation = true;
            }
		});
		$scope.loading=false;
	}
	loadAssociations();
});

