'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('categorieCtrl', function ($scope, serviceAjax, $routeParams, $location, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.categorie_id = $routeParams.id;

     //Recherche de la catégorie séléectionné
    var loadCategorie = function(){
      $scope.loading = true;
      serviceAjax.get("itemtypes/"+$scope.categorie_id).then(function(data){
        $scope.type = data.data.name;
        console.log(data.data.name);
      })
    }
    loadCategorie();
    
    //Chargement des items en fonction de la catégorie sélectionnée
    var loadItem = function(){
      $scope.loading=true;
      serviceAjax.get("items/categories/"+$scope.categorie_id).then(function(data){
        $scope.items = data.data;
      });
      $scope.loading=false;
    }
    loadItem();

  });
