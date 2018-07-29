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
.controller('inWrapperCtrl', function($scope, serviceAjax, $http){
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
		serviceAjax.get("associations").then(function(data){
	    	console.log("Poulet",data.data);

	    	$scope.assos=data.data;
		});
		$scope.loading=false;
	}
	loadAssociations();
});

