'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('indexItemsCtrl', function ($scope, serviceAjax, $location, $rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if(!$rootScope.isAdmin()){
      $location.path('/error/403');
    }

    $scope.items = []


     //Recherche de la catégorie séléectionné
    var loadItems = function(){
      $scope.loading = true;
      serviceAjax.get("items").then(function(data){
        $scope.items = data.data;
      })
    }
    loadItems();

    /* Tri des catégories */
    $scope.reverse = false;

    $scope.sort = function() {
      $scope.reverse = !$scope.reverse;
    };

  });

