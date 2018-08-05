'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('MyItemsCtrl', function ($scope, serviceAjax, $routeParams, $location, $http, focusMe, $timeout) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    /*Initialisation des boutons de confirmation*/
    $scope.addConfirmation = false;
    $scope.updateConfirmation = false;
    $scope.deleteConfirmation = false;

    $scope.asso_id = $routeParams.asso_id;

    var loadAssociation = function(){
      $scope.loading=true;
      serviceAjax.get("associations/"+$scope.asso_id).then(function(data){
        $scope.asso = data.data.name;
      });
      $scope.loading=false;
    }
    loadAssociation();

    var loadItemTypes = function(){
        $scope.loading = true;
      serviceAjax.get("itemtypes").then(function(data){
            $scope.types=data.data;
            //Initialisation du type du nouvel item avec le premier élément des types
            $scope.newItem.type = ""+$scope.types[0].id;
        });
    };
    loadItemTypes();

    var loadItemPlaces = function(){
        $scope.loading = true;
      serviceAjax.get("itemplaces").then(function(data){
            $scope.places=data.data;
            //Initialisation de la localisation du nouvel item avec le premier élément des localisations 
            $scope.newItem.place = "" + $scope.places[0].id;
        });
      
    };
    loadItemPlaces();

    
    //Chargement des items en fonction de l'association sélectionnée
    var loadItem = function(){
      $scope.loading=true;
      serviceAjax.get("association/items/"+$scope.asso_id).then(function(data){
        $scope.items = data.data;
        for (var i = $scope.items.length - 1; i >= 0; i--) {
          //Permet d'affecter au ng-model d'edition des éléments
          $scope.items[i].typeSection = $scope.types.filter((r)=>r.id == $scope.items[i].type)[0];
          $scope.items[i].placeSection = $scope.places.filter((r)=>r.id == $scope.items[i].place)[0];
          $scope.items[i].status = $scope.items[i].status.toString();
        }
      });
      $scope.loading=false;
      
    }
    loadItem();

    //Pour afficher le formulaire d'ajout d'un nouvel item
    $scope.addNewItem = false;
    
    var loadNewItem = function(){
      //Pour remplir le nouvel item
      $scope.newItem = {};
      //Paramètre par défaut
      $scope.newItem.status = "1";
      $scope.newItem.association = $routeParams.asso_id;
    }

    loadNewItem();

    /* Gestion des tries des items*/
    $scope.propertyName = 'name';
    $scope.reverse = false;

    $scope.sortBy = function(propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
    };

    /* Fonctions de gestions des items*/

    $scope.add = function(){
      loadItem();
      $scope.addNewItem = true;
      $scope.focusInput = true;
    }

    $scope.edit = function($item){
      $scope.addNewItem = false;       
      $item.edit=!$item.edit;
    }

    $scope.update = function($item){
      console.log($item);
      if($item.typeSection)
        $item.type = $item.typeSection.id;
      if($item.placeSection)
        $item.place = $item.placeSection.id;
      $http.put('http://localhost:8000/api/v1/items/'+ $item.id, $item).then(function(){
        $item.edit = !$item.edit;
        loadItem();
        $scope.updateConfirmation = true;
        $timeout(function() {
           $scope.updateConfirmation = false;
        }, 3000)
      })
    }

    $scope.cancel = function(){
      $scope.addNewItem = false;
      loadItem();
    }

    $scope.save = function(){
      console.log($scope.newItem);
      $scope.loading=true;
      serviceAjax.post('items', $scope.newItem, 'POST').then(function(){
        loadItem();
        $scope.addConfirmation = true;
        $timeout(function() {
           $scope.addConfirmation = false;
        }, 3000)
      })
      console.log($scope.items);      

      $scope.loading=false;
      $scope.addNewItem = false;

      loadNewItem();
      $scope.newItem.type = ""+$scope.types[0].id;
      $scope.newItem.place = "" + $scope.places[0].id;
    }



    $scope.delete = function($item){
      $http.delete('http://localhost:8000/api/v1/items/'+ $item.id).then(function(){
        loadItem();
        $scope.deleteConfirmation = true;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
      })

    }

  });

