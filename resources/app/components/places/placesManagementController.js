'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('placesManagementCtrl', function ($scope, serviceAjax, $location, $http, focusMe, $timeout) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    /*Initialisation des boutons de confirmation*/
    $scope.addConfirmation = false;
    $scope.updateConfirmation = false;
    $scope.deleteConfirmation = false;

    //Pour afficher le formulaire d'ajout d'une nouvelle catégorie
    $scope.addNewPlace = false;
    
    var loadNewPlace = function(){
      //Pour remplir la nouvelle catégorie
      $scope.newPlace = {};
    }

    loadNewPlace();


     //Recherche de la catégorie séléectionné
    var loadPlace = function(){
      $scope.loading = true;
      serviceAjax.get("itemplaces").then(function(data){
        $scope.places = data.data;
      })
    }
    loadPlace();

    /* Tri des catégories */
    $scope.reverse = false;

    $scope.sort = function() {
      $scope.reverse = !$scope.reverse;
    };

    /* Fonctions de gestions des catégories*/

    $scope.add = function(){
      $scope.addNewPlace = true;
      $scope.focusInput = true;
    }

    $scope.edit = function($place){
      $place.edit=!$place.edit;
    }

    $scope.update = function($place){
      serviceAjax.put('itemplaces/'+ $place.id, $place).then(function(){
        $place.edit = !$place.edit;
        $scope.updateConfirmation = true;
        $timeout(function() {
           $scope.updateConfirmation = false;
        }, 3000);
      })
    }

    $scope.cancel = function(){
      $scope.addNewPlace = false;
      loadPlace();
    }

    $scope.save = function(){
      $scope.loading=true;
      console.log($scope.newPlace)
      serviceAjax.post('itemplaces', $scope.newPlace).then(function(){
        loadPlace();
        $scope.addConfirmation = true;
        $timeout(function() {
           $scope.addConfirmation = false;
        }, 3000)
      })
      $scope.loading=false;
      $scope.addNewPlace = false;
      loadNewPlace();
    }



    $scope.delete = function($place){
      serviceAjax.delete('itemplaces/'+ $place.id).then(function(){
        loadPlace();
        $scope.deleteConfirmation = true;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
      })

    }

  });

