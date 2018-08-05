'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('categorieCtrl', function ($scope, serviceAjax, $routeParams, $location, $http, $rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.categorie_id = $routeParams.id;

     //Recherche de la catégorie séléectionné
    var loadCategorie = function(){
      $scope.loading = true;
      if($scope.categorie_id == 0){
        $scope.type = 'Totalité du matériel';
      }
      else {
        serviceAjax.get("itemtypes/"+$scope.categorie_id).then(function(data){
        $scope.type = data.data.name;
        });
      }
    }
    loadCategorie();

    /* Gestion des tries des items*/
    $scope.propertyName = 'name';
    $scope.reverse = false;

    $scope.sortBy = function(propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
    };
    
    
    //Chargement des items en fonction de la catégorie sélectionnée

    var loadItem = function(){
      $scope.loading=true;
      serviceAjax.get("items/categories/" + $scope.categorie_id)
        .then(function(data){
          $scope.items = data.data;
        });
      $scope.loading=false;
    };
    loadItem();

  });
