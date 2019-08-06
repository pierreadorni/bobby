'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('placesManagementCtrl', function ($scope, serviceAjax, $location, $rootScope, $timeout, Data) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if(!$rootScope.isAdmin()){
      $location.path('/error/403');
    }

    /*Initialisation des boutons de confirmation*/
    $scope.addConfirmation = false;
    $scope.updateConfirmation = false;
    $scope.deleteConfirmation = false;
    $scope.error = false;
    $scope.inputErrors = "";

    //Pour afficher le formulaire d'ajout d'une nouvelle catégorie
    $scope.addNewPlace = false;
    $scope.newPlaceLoading = false;
    
    var loadNewPlace = function(){
      //Pour remplir la nouvelle catégorie
      $scope.newPlace = {};
    }

    loadNewPlace();


     //Recherche de la catégorie séléectionné
    var loadPlace = function(){
      $scope.loading = true;
      $scope.places = Data.loadItemPlaces();
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

    $scope.update = function(place){
      place.loading = true;
      serviceAjax.put('itemplaces/'+ place.id, place).then(function(){
        place.edit = !place.edit;
        place.loading = false;
        $scope.updateConfirmation = true;
        $timeout(function() {
           $scope.updateConfirmation = false;
        }, 3000);
        // Mise à jour Data Factory
        serviceAjax.get('itemplaces').then(function(res){
          Data.setItemPlaces(res.data);
        })
      }, function(error){
        if (error.status == 422) {
          $scope.inputErrors = error.data.errors;
        }
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
        place.loading = false;
      })
    }

    $scope.cancel = function(){
      $scope.addNewPlace = false;
      loadNewPlace();
    }

    $scope.cancelPlace = function(place){
      let index = $scope.places.findIndex((p) => p.id === place.id);
      place.loading = true;
      serviceAjax.get('itemplaces/' + place.id).then(function(res){
        $scope.places[index] = res.data;
      }, function(error){
        place.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
      })
    }

    $scope.save = function(){
      $scope.newPlaceLoading=true;
      serviceAjax.post('itemplaces', $scope.newPlace).then(function(res){
        $scope.places.push(res.data);
        $scope.addConfirmation = true;
        $scope.newPlaceLoading=false;
        $scope.addNewPlace = false;
        loadNewPlace();
        $timeout(function() {
           $scope.addConfirmation = false;
        }, 3000)
        // Mise à jour Data Factory
        serviceAjax.get('itemplaces').then(function(res){
          Data.setItemPlaces(res.data);
        })
      }, function(error){
        if (error.status == 422) {
          $scope.inputErrors = error.data.errors;
        }
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
        $scope.newPlaceLoading = false;
      })
      
    }



    $scope.delete = function($place){
      serviceAjax.delete('itemplaces/'+ $place.id).then(function(){
      place.loading = true;
      serviceAjax.delete('itemplaces/'+ place.id).then(function(){
        $scope.places = $scope.places.filter((p) => p.id != place.id);
        $scope.deleteConfirmation = true;
        place.loading = false;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
        // Mise à jour Data Factory
        serviceAjax.get('itemplaces').then(function(res){
          Data.setItemPlaces(res.data);
        })
      }, function(){
        place.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
      })

    }

  });

