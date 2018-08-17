angular.module('bobbyApp')  
  .directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
      return {
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
          var model = $parse(attrs.focusMe);
          scope.$watch(model, function (value) {
            console.log('value=', value);
            if (value === true) {
              $timeout(function () {
                element[0].focus();
              });
            }
          });
          // to address @blesh's comment, set attribute value to 'false'
          // on blur event:
          element.bind('blur', function () {
            console.log('blur');
            scope.$apply(model.assign(scope, false));
          });
        }
      };
  }]);
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
		serviceAjax.get("userassos").then(function(data){
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


app.directive('outWrapper', function($rootScope) {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {},
    controller: function($rootScope, $scope) {
    },
    templateUrl: 'app/directives/outWrapper/out_wrapper.html',
  };
});
