'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('categoriesManagementCtrl', function ($scope, serviceAjax, $location, $http, $timeout) {
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
    $scope.addNewCategorie = false;
    
    var loadNewCategorie = function(){
      //Pour remplir la nouvelle catégorie
      $scope.newCategorie = {};
    }

    loadNewCategorie();


     //Recherche de la catégorie séléectionné
    var loadCategorie = function(){
      $scope.loading = true;
      serviceAjax.get("itemtypes").then(function(data){
        $scope.categories = data.data;
      })
    }
    loadCategorie();

    /* Tri des catégories */
    $scope.reverse = false;

    $scope.sort = function() {
      $scope.reverse = !$scope.reverse;
    };

    /* Fonctions de gestions des catégories*/

    $scope.add = function(){
      $scope.addNewCategorie = true;
      $scope.focusInput = true;
    }

    $scope.edit = function($categorie){
      $categorie.edit=!$categorie.edit;
    }

    $scope.update = function($categorie){
      serviceAjax.put('itemtypes/'+ $categorie.id, $categorie).then(function(){
        $categorie.edit = !$categorie.edit;
        $scope.updateConfirmation = true;
        $timeout(function() {
           $scope.updateConfirmation = false;
        }, 3000)
      })
    }

    $scope.cancel = function(){
      $scope.addNewCategorie = false;
      loadCategorie();
    }

    $scope.save = function(){
      $scope.loading=true;
      serviceAjax.post('itemtypes', $scope.newCategorie).then(function(){
        loadCategorie();
        $scope.addNewCategorie = false;
        $scope.addConfirmation = true;
        $timeout(function() {
           $scope.addConfirmation = false;
        }, 3000)
      })
      $scope.loading=false;
      
      loadNewCategorie();
    }



    $scope.delete = function($categorie){
      serviceAjax.delete('itemtypes/'+ $categorie.id).then(function(){
        loadCategorie();
        $scope.deleteConfirmation = true;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
      })

    }

  });

