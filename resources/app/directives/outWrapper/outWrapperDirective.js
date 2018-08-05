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
