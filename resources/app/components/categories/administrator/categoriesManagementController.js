'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('categoriesManagementCtrl', function ($scope, serviceAjax, $rootScope, $timeout, Data) {
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
    $scope.addNewCategorie = false;
    $scope.newCategorieLoading = false;
    
    var loadNewCategorie = function(){
      //Pour remplir la nouvelle catégorie
      $scope.newCategorie = {};
    }

    loadNewCategorie();


     //Recherche de la catégorie séléectionné
    var loadCategorie = function(){
      $scope.loading = true;
      $scope.categories = Data.loadItemTypes();
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

    $scope.edit = function(categorie){
      categorie.edit=!categorie.edit;
    }

    $scope.update = function(categorie){
      categorie.loading = true;
      serviceAjax.put('itemtypes/'+ categorie.id, categorie).then(function(){
        categorie.edit = !categorie.edit;
        $scope.updateConfirmation = true;
        categorie.loading = false;
        $timeout(function() {
           $scope.updateConfirmation = false;
        }, 3000)
        // Mise à jour Data Factory
        serviceAjax.get('itemtypes').then(function(res){
          Data.setItemTypes(res.data);
        })
      }, function(error){
        categorie.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
        if (error.status == 422) {
          $scope.inputErrors = error.data.errors;
        }
      })
    }

    $scope.cancel = function(){
      $scope.addNewCategorie = false;
      loadNewCategorie();
    }

    $scope.cancelCategorie = function(categorie){
      let index = $scope.categories.findIndex((c) => c.id === categorie.id);
      categorie.loading = true;
      serviceAjax.get('itemtypes/' + categorie.id).then(function(res){
        $scope.categories[index] = res.data;
      }, function(error){
        categorie.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
      })
    }

    $scope.save = function(){
      $scope.newCategorieLoading=true;
      serviceAjax.post('itemtypes', $scope.newCategorie).then(function(res){
        $scope.categories.push(res.data);
        $scope.addNewCategorie = false;
        $scope.addConfirmation = true;
        $scope.newCategorieLoading = false;
        loadNewCategorie();
        $timeout(function() {
           $scope.addConfirmation = false;
        }, 3000)
        // Mise à jour Data Factory
        serviceAjax.get('itemtypes').then(function(res){
          Data.setItemTypes(res.data);
        })
      }, function(error){
        if (error.status == 422) {
          $scope.inputErrors = error.data.errors;
        }
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
        $scope.newCategorieLoading = false;
      })
    }

    $scope.setDeleteAttribute = function(type){
      $scope.elementToDelete = type;
    }



      categorie.loading = true;
      serviceAjax.delete('itemtypes/'+ categorie.id).then(function(){
        categorie.loading = false;
        $scope.categories = $scope.categories.filter((c) => c.id != categorie.id);
        $scope.deleteConfirmation = true;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
        // Mise à jour Data Factory
        serviceAjax.get('itemtypes').then(function(res){
          Data.setItemTypes(res.data);
        })
      }, function(error){
        categorie.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
      })

    }

  });

