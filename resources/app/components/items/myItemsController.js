'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('MyItemsCtrl', function ($scope, serviceAjax, $routeParams, $location, Data, $timeout, $rootScope) {

    /*Initialisation des boutons de confirmation*/
    $scope.addConfirmation = false;
    $scope.updateConfirmation = false;
    $scope.deleteConfirmation = false;
    $scope.error = false;

    $scope.loading = true;

    $scope.asso_uid = $routeParams.asso_uid;

    //Pour afficher le formulaire d'ajout d'un nouvel item
    $scope.addNewItem = false;
    $scope.newitem_loading = false;
    
    var loadNewItem = function(){
      //Pour remplir le nouvel item
      $scope.newItem = {};
      //Paramètre par défaut
      $scope.newItem.status = "1";
      $scope.newItem.association_id = $routeParams.asso_uid;
    }

    loadNewItem();

    var checkData = function(){
      if ($scope.items && $scope.places && $scope.items) {
        for (var i = $scope.items.length - 1; i >= 0; i--) {
          //Permet d'affecter au ng-model d'edition des éléments
          $scope.items[i].typeSection = $scope.types.filter((r)=>r.id == $scope.items[i].type)[0];
          $scope.items[i].placeSection = $scope.places.filter((r)=>r.id == $scope.items[i].place)[0];
          $scope.items[i].status = $scope.items[i].status.toString();
        }
        $scope.loading = false;
      }
    }


    var loadAssociation = function(){
      serviceAjax.get("associations/"+$scope.asso_uid).then(function(data){
        $scope.asso = data.data.shortname;
        $scope.asso_login = data.data.login;
        if (!$rootScope.isMemberAsso($scope.asso_login)) {
          $location.path('/error/403')
        }
      }, function(error){
        $location.path('/error/500')
      });
    }
    loadAssociation();

    var loadItemTypes = function(){
      $scope.loading = true;
      $scope.types=Data.loadItemTypes();
      //Initialisation du type du nouvel item avec le premier élément des types
      $scope.newItem.type_id = ""+$scope.types[0].id;
      checkData();
    };
    loadItemTypes();

    var loadItemPlaces = function(){
      $scope.places=Data.loadItemPlaces();
      //Initialisation de la localisation du nouvel item avec le premier élément des localisations 
      $scope.newItem.place_id = "" + $scope.places[0].id;
      checkData();
    };
    loadItemPlaces();

    
    //Chargement des items en fonction de l'association sélectionnée
    var loadItem = function(){
      $scope.loading=true;
      serviceAjax.get("association/items/"+$scope.asso_uid).then(function(data){
        $scope.items = data.data;
        checkData();
      });  
    }
    loadItem();


    /* Gestion des tries des items*/
    $scope.propertyName = 'name';
    $scope.reverse = false;

    $scope.sortBy = function(propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
    };

    /* Fonctions de gestions des items*/

    // Pour vérifier que les données sont correctes
    $scope.checkItem = function(item){
      if (item.name && item.place && item.type && item.quantity && item.association_id && item.status && item.caution !== null) {
        return true;
      }
      return false;
    }

    $scope.add = function(){
      $scope.addNewItem = true;
      $scope.focusInput = true;
    }

    $scope.edit = function($item){
      $scope.addNewItem = false;       
      $item.edit=!$item.edit;
    }

    $scope.update = function(item){
      if(item.type)
        item.type_id = item.type.id;
      if(item.place)
        item.place_id = item.place.id;
      serviceAjax.put('items/'+ item.id, item).then(function(){
        item.edit = !item.edit;
        $scope.updateConfirmation = true;
        $timeout(function() {
           $scope.updateConfirmation = false;
        }, 3000)
      }, function(error){
        if (error.status == 422) {
          $scope.inputErrors = error.data.errors;
        }
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
        item.loading = false;
      })
    }

    $scope.cancel = function(){
      $scope.addNewItem = false;
      loadNewItem();
    }

    $scope.cancelItem = function(item){
      let index = $scope.items.findIndex((c) => c.id === item.id);
      item.loading = true;
      serviceAjax.get('items/' + item.id).then(function(res){
        $scope.items[index] = res.data;
      }, function(error){
        item.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
      })
    }

    $scope.save = function(){
      $scope.newitem_loading=true;
      if($scope.newItem.place){
        $scope.newItem.place_id = $scope.newItem.place.id;
      }
      if($scope.newItem.type){
        $scope.newItem.type_id = $scope.newItem.type.id;
      }
      serviceAjax.post('items', $scope.newItem).then(function(res){
        $scope.items.push($scope.newItem);
        $scope.newitem_loading = false;
        $scope.addConfirmation = true;
        $scope.addNewItem = false;
        loadNewItem();
        $timeout(function() {
           $scope.addConfirmation = false;
        }, 3000)
      }, function(error){
        if (error.status == 422) {
          $scope.inputErrors = error.data.errors;
        }
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
        $scope.newitem_loading = false;
      })
    }


    $scope.delete = function(item){
      item.loading = true;
      serviceAjax.delete('items/'+ item.id).then(function(){
        $scope.items = $scope.items.filter((i) => i.id != item.id);
        item.loading = false;
        $scope.deleteConfirmation = true;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
      }, function(error){
        item.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
      })

    }


    $scope.redirectToDate = function(){
      window.location.href="#!/data"
    }

  });

