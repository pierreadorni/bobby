'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('editBookingCtrl', function ($scope, $routeParams, serviceAjax, $location, $filter, $rootScope, moment) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if (!$rootScope.canBook() && !$rootScope.isAdmin()) {
      $location.path('/error/403')
    }

    //Current date
    $scope.currentDate = new Date();
    $scope.loading = true;
    $scope.error = false;
    $scope.booking_id = $routeParams.id;

    var loadDates = function(){
      // Pour les items de la commande, formatage de la date au bon format
      for (let index = 0; index < $scope.booking.bookinglines.length; index++) {
        const startDate = $scope.booking.bookinglines[index].startDate;
        const endDate = $scope.booking.bookinglines[index].endDate;
        $scope.booking.bookinglines[index].startDateAngular = new Date(moment(startDate).get('year'), moment(startDate).get('month'), moment(startDate).get('date'));
        $scope.booking.bookinglines[index].endDateAngular = new Date(moment(endDate).get('year'), moment(endDate).get('month'), moment(endDate).get('date'));
      }
    }

     //Recherche de la catégorie séléectionné
    var loadBookings = function(){
      $scope.loading = true;
      serviceAjax.get("bookings/" + $scope.booking_id).then(function(data){
        $scope.booking = data.data;
        $scope.loading = false;

        //On vérifie que l'utilisateur est admin d'une association (déjà vérifié dans l'API) 
        // L'user peut etre admin
        if (!$rootScope.isAdmin()) {
          if (!$scope.booking.isAdminAsso($scope.booking.owner.login) && !$scope.booking.isAdminAsso($scope.booking.booker.login)) {
            $location.path('/error/403')
          }
        }  
        loadDates();       
      }, function(error){$scope.error = true;})
    }
    loadBookings();


    /* PARTIE INFORMATION GENERALE */

    //Remise de la caution
    $scope.cautionReceived = function(){
      $scope.booking.cautionReceived = "Oui";
      $scope.loading = true;
      serviceAjax.post('bookings/caution/' + $scope.booking.id).then(function(){
        $scope.loading = false;
      }, function(error){$scope.error = true;});
    }


    //Validation de tous les items de la commande
    $scope.acceptBooking = function(){
      $scope.loading = true;
      serviceAjax.get("bookings/accept/" + $scope.booking_id).then(function(){
        serviceAjax.get("bookings/" + $scope.booking_id).then(function(res){
          $scope.booking = res.data;
          $scope.loading = false;
          loadDates();
        })
      }, function(error){$scope.error = true;})
    }

    //Annulation de la réservation
    $scope.cancelBooking = function(){
      $scope.loading = true;
      serviceAjax.get('bookings/cancel/' + $scope.booking.id, $scope.booking).then(function(){
        serviceAjax.get("bookings/" + $scope.booking_id).then(function(res){
          $scope.booking = res.data;
          $scope.loading = false;
          loadDates();
        })
      }, function(error){$scope.error = true;})
    }

    //Validation du rendu du matériel pour tous les items
    $scope.returnedBooking = function(){
      $scope.loading = true;
      serviceAjax.get('bookings/returned/' + $scope.booking.id, $scope.booking).then(function(){
        serviceAjax.get("bookings/" + $scope.booking_id).then(function(res){
          $scope.booking = res.data;
          $scope.loading = false;
          loadDates();
        })
      }, function(error){$scope.error = true;})
    }


    /* PARTIE MATERIEL */

    //Editer un item
    $scope.edit=function($item){
      $item.edit = !$item.edit;
    }

    //Accepter un item
    $scope.acceptLine =function(bookingline){
      $scope.loading = true;
      serviceAjax.get('bookinglines/accept/' + bookingline.id).then(function(res){
        bookingline.status = 2;
        bookingline.statusName = "Validé"
        // On vérifie que le statut général de la commande n'a pas changé
        serviceAjax.get('bookings/' + bookingline.booking).then(function(res){
          if ($scope.booking.status != res.data.status) {
            $scope.booking.status = res.data.status;
            $scope.booking.statusName = res.data.statusName;
          }
          $scope.loading = false
        })
      }, function(error){$scope.error = true;})
    }

    //Annuler un item
    $scope.cancelLine=function(bookingline){
      $scope.loading = true;
      serviceAjax.get('bookinglines/cancel/' + bookingline.id).then(function(res){
        bookingline.status = 4;
        bookingline.statusName = "Annulé"
        // On vérifie que le statut général de la commande n'a pas changé
        serviceAjax.get('bookings/' + bookingline.booking).then(function(res){
          if ($scope.booking.status != res.data.status) {
            $scope.booking.status = res.data.status;
            $scope.booking.statusName = res.data.statusName;
          }
          $scope.loading = false;
        })
      }, function(error){$scope.error = true;})
    }

    //Item rendu
    $scope.returnedLine=function(bookingline){
      $scope.loading = true;
      serviceAjax.get('bookinglines/returned/' + bookingline.id).then(function(res){
        bookingline.status = 3;
        bookingline.statusName = "Rendu"
        // On vérifie que le statut général de la commande n'a pas changé
        serviceAjax.get('bookings/' + bookingline.booking).then(function(res){
          if ($scope.booking.status != res.data.status) {
            $scope.booking.status = res.data.status;
            $scope.booking.statusName = res.data.statusName;
          }
          $scope.loading = false;
        })
      }, function(error){$scope.error = true;})
    }

    //Mise à jour d'un item et validation
    $scope.updateItem=function(item){
      $scope.loading = true;
      item.startDate = $filter('date')(item.startDateAngular, "yyyy-MM-dd")
      item.endDate = $filter('date')(item.endDateAngular, "yyyy-MM-dd")
      serviceAjax.put("bookinglines/"+item.id, item).then(function(res){
        item.edit = false;
        $scope.loading = false;
        if ($rootScope.isAdminAsso($scope.booking.owner.login)) {
          // Si c'est le propriétaire qui a fait la validation on valide l'item
          $scope.acceptLine(item);
        }
      }, function(error){$scope.error = true;})
    }

  });

