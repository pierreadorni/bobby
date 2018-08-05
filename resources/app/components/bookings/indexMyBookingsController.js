'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('indexMyBookingsCtrl', function ($scope, serviceAjax, $location) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.data = {}
    $scope.singleAssociation = true;

    //Chargement des associations de l'utilisateur
    var loadAssociations = function(){
    $scope.loading = true;
    serviceAjax.get("associations").then(function(data){
        $scope.singleAssociation = false;
        $scope.assos=data.data;

        /*S'il n'y a qu'une seule association elle est chargée dès le départ*/
        if($scope.assos.length==1){
          $scope.data.asso_id = $scope.assos[0].id;
          //Pour empêcher le select des assos de s'afficher
          $scope.singleAssociation = true;
          loadBookings();
        }
      });
      $scope.loading=false;
    }
    loadAssociations();

    /* Listener sur la valeur de asso_id */
    $scope.$watch("data.asso_id", function(){
      loadBookings();
    });

    /*Filtre en fonction du statut des réservations*/
    $scope.status = 1;
    $scope.status2 = 1;

    $scope.changeStatus=function(nb){
      $scope.status = nb;
      console.log('asso', $scope.blabla)
    }

    $scope.changeStatus2=function(nb){
      $scope.status2 = nb;
    }

    //Pour modifier les nav-item actifs 
    $scope.isActive = function(nb){
      return $scope.status == nb;
    }
    $scope.isActive2 = function(nb){
      return $scope.status2 == nb;
    }

     //Recherche de la catégorie séléectionné
    var loadBookings = function(){
      $scope.loading = true;
      serviceAjax.get("bookings/asso/" + $scope.data.asso_id).then(function(data){
        $scope.bookings = data.data;
        console.log("donnees", $scope.bookings)
      })
    }
    //loadBookings();

    /* Gestion des tries des items*/
    $scope.propertyName = 'booker';
    $scope.reverse = false;

    $scope.sortBy = function(propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
    };

    /* Ouverture d'une réservation */
    $scope.open= function($id){
      console.log($id);
    }

  });

