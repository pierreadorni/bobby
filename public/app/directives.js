angular.module('bobbyApp')  
  .directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
      return {
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
          var model = $parse(attrs.focusMe);
          scope.$watch(model, function (value) {
            if (value === true) {
              $timeout(function () {
                element[0].focus();
              });
            }
          });
          // to address @blesh's comment, set attribute value to 'false'
          // on blur event:
          element.bind('blur', function () {
            scope.$apply(model.assign(scope, false));
          });
        }
      };
  }]);
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
.controller('inWrapperCtrl', function($scope, serviceAjax, Data){
	this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

	$scope.loading = true;

    var checkLoading = function(){
		if (!$scope.loading_assos && !$scope.loading_types) {
			$scope.loading = false;
		}
	}


    /** Chargement des différents catégories **/

	var loadItemTypes = function(){
		$scope.loading_types = true
		$scope.types = Data.loadItemTypes();
		$scope.loading_types = false;
		checkLoading();		
	}

	loadItemTypes();


	/** Chargement des associations de l'utilisateur **/

	var loadAssociations = function(){
		$scope.loading_assos = true;
		$scope.userassos = Data.loadUserAssos();

		if($scope.userassos.length == 1){
			/* Si l'utilisateur ne fait parti que d'une seule association */
			$scope.singleAssociation = true;
		}

		$scope.loading_assos=false;
		checkLoading();
	}

	loadAssociations();

});

