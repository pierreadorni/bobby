'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('bookingsCtrl', function ($scope, serviceAjax, $routeParams, $location, $http, focusMe, $timeout) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Emprunt
    $scope.booking = {}

    /*Chargement des associations d'un utilisateur*/
    var loadAssociations = function(){
    $scope.loading = true;
    serviceAjax.get("associations").then(function(data){
        $scope.assos=data.data;
    });
    $scope.loading=false;
  }
  loadAssociations();

  //Fonction pour la sélection de l'association demandant un item
  $scope.assoRequesting = function($id){
    $scope.booking.assoRequesting = $scope.assos.filter((r)=>r.id == $id)[0];
    console.log($scope.booking);
    //Chargement des associations hormis celles sélectionnées
    loadAssociationsRequested($id);
  }

  /*Chargement des associations d'un utilisateur*/
    var loadAssociationsRequested = function($id){
    $scope.loading = true;
    serviceAjax.get("booking/assos/"+$id).then(function(data){
        $scope.assosRequested=data.data;
    });
    $scope.loading=false;
  }
  
  //Fonction pour la sélection de l'association possédant les items à emprunter
  $scope.associationRequested = function($id){
    $scope.booking.assoRequested = $scope.assos.filter((r)=>r.id == $id)[0];
    loadItem($scope.booking.assoRequested.id);
    console.log($scope.booking);
    //Chargement des associations hormis celles sélectionnées
  }

  /***  ETAPE 3 ***/
  //Chargement des items en fonction de l'association sélectionnée
  //ATTENTION FAIRE REQUETE SANS CAUTION ETC //
    var loadItem = function($id){
      $scope.loading=true;
      serviceAjax.get("booking/items/" + $id).then(function(data){
        $scope.items = data.data;
        console.log("items", $scope.items)
      });
      $scope.loading=false;
      
    }  

    //Items réservés 
    $scope.booking.items = [];

    //Ajouter un item dans le panier en baissant la quantité d'items restantes
    $scope.addItem = function($item){
      //$scope.bboking
      $item.quantity--;

      var index = $scope.booking.items.map((p) => { return p.id; }).indexOf($item.id);
      console.log(index);
      if(index == -1) {
            $scope.booking.items.push({
                id: $item.id,
                name: $item.name,
                quantity: 1,
            })
        }else {
            var itemBooked = $scope.booking.items[index]
            itemBooked.quantity += 1;
        }
    }

    /*** RESUME DE LA RESERVATION ***/
    //Fonction permettant d'ajouter dans le résumé de la réservation un item si le stock le permet (icone +)
    $scope.addItemByIndex = function($index){
      var itemBooked = $scope.booking.items[$index];
      var item = $scope.items.filter((r)=>r.id == itemBooked.id)[0];
        if(item.quantity > 0){
            item.quantity--;
            itemBooked.quantity++;
        }
    }

    //Fonction permettant dde diminuer dans le résumé de la réservation un item si le stock le permet (icone -)
    $scope.removeProductByIndex=function($index){
      var itemBooked = $scope.booking.items[$index];
      var item = $scope.items.filter((r)=>r.id == itemBooked.id)[0];
      item.quantity++;
      itemBooked.quantity--;
        if(itemBooked.quantity == 0){
            $scope.booking.items.splice($index, 1);
        }
    }

  });

