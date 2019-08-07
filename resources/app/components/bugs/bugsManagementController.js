'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('bugsManagementCtrl', function ($scope, serviceAjax, $location, $rootScope, $timeout, Data) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if(!$rootScope.isAdmin()){
      $location.path('/error/403');
    }

    $scope.error = false;
    $scope.deleteConfirmation = false;


    // Chargement des bugs
    var loadBugs = function(){
      $scope.loading = true;
      serviceAjax.get('bugs').then(function(res){
        $scope.bugs = res.data;
        for (let index = 0; index < $scope.bugs.length; index++) {
          $scope.bugs[index].loading = false;
        }
      })
    }
    loadBugs();

    
    $scope.delete = function(bug){
      $scope.loading = true;
      serviceAjax.delete('bugs/'+ bug.id).then(function(){
        $scope.bugs = $scope.bugs.filter((b) => b.id != bug.id);
        $scope.loading = false;
        $scope.deleteConfirmation = true;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
      }, function(){
        $scope.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
      })
    }

  });

