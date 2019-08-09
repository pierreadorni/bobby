'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('indexMyBookingsCtrl', function ($scope, serviceAjax, Data, $rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    if (!$rootScope.canBook()) {
      $location.path('/error/403')
    }
    
    $scope.data = {}
    $scope.assos = [];
    $scope.singleAssociation = true;
    

    //Recherche de la catégorie séléectionné
    var loadBookings = function(){
      $scope.loading = true;
      serviceAjax.get("bookings/asso/" + $scope.data.asso_id).then(function(data){
        $scope.bookings = data.data;
      })
    }

    //Chargement des associations de l'utilisateur
    var loadAssociations = function(){
      $scope.loading = true;
      //serviceAjax.get("userassos").then(function(data){
      $scope.singleAssociation = false;
      const assos = Data.loadUserAssos();

      // Dans les associations rechercher des assos ou l'user est admin
      for (let index = 0; index < assos.length; index++) {
        if ($rootScope.isAdminAsso(assos[index].login)) {
          $scope.assos.push(assos[index]);
        }
      }
      /*S'il n'y a qu'une seule association elle est chargée dès le départ*/
      if($scope.assos.length==1){
        $scope.data.asso_id = $scope.assos[0].id;
        //Pour empêcher le select des assos de s'afficher
        $scope.singleAssociation = true;
        loadBookings();
      }
      $scope.loading=false;
    }
    loadAssociations();

    /* Listener sur la valeur de asso_id */
    $scope.$watch("data.asso_id", function(){
      if ($scope.data.asso_id) {
        loadBookings();
      }
    });

    /*Filtre en fonction du statut des réservations*/
    $scope.status = 1;
    $scope.status2 = 1;

    $scope.changeStatus=function(nb){
      $scope.status = nb;
    }

    $scope.changeStatus2=function(nb){
      $scope.status2 = nb;
    }

    //Pour modifier les nav-item actifs 
    $scope.isActive = function(nb){
      if ($scope.status == 4) {
        return $scope.status;
      }
      return $scope.status == nb;
    }
    $scope.isActive2 = function(nb){
      return $scope.status2 == nb;
    }

    // Détermine si la commande doit être montrée
    // Avec statut 4 on montre toutes les commandes
    $scope.showBooking = function(booking){
      if ($scope.status == 4) {
        return true;
      }
      return booking.status == $scope.status;
    }


    $scope.showBooking2 = function(booking){
      if ($scope.status2 == 4) {
        return true;
      }
      return booking.status == $scope.status2;
    }


    /* Gestion des tries des items*/
    $scope.propertyName = 'booker';
    $scope.reverse = false;

    $scope.sortBy = function(propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
    };

  });

