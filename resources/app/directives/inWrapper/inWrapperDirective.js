app.directive('inWrapper', function() {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {},
        controller: function() {
        },
        templateUrl: 'app/directives/inWrapper/in_wrapper.html',
    };
})
.controller('inWrapperCtrl', function($scope, serviceAjax, $http, $rootScope){
	this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

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
		//serviceAjax.get("userassos").then(function(data){
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

