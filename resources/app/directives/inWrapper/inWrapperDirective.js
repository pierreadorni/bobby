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
.controller('inWrapperCtrl', function($scope, serviceAjax, Data, $rootScope){
	this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

	$scope.loading = true;

	$scope.bug = {}

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

	$scope.sendBug = function(){
		$scope.bug.comment += "\nEcrit par: " + $rootScope.auth.member.email
		serviceAjax.post('bugs', $scope.bug).then(function(res){
			$scope.bug= {};
		});
	}

});

