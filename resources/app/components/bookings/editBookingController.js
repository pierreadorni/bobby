'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('editBookingCtrl', function ($scope, $routeParams, serviceAjax, $location, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.booking_id = $routeParams.id;
    console.log("booking", $scope.booking_id)

     //Recherche de la catégorie séléectionné
    var loadBookings = function(){
      $scope.loading = true;
      serviceAjax.get("bookings/" + $scope.booking_id).then(function(data){
        $scope.booking = data.data;
        console.log("donnees", $scope.booking)
      })
    }
    loadBookings();



    /* PARTIE MATERIEL */

    //Accepter un item
    $scope.accept=function($bookingline){
      $bookingline.status = 2;
      $bookingline.statusName = "Validé";
      var updateBookingLine = {};
      updateBookingLine.status = 2;
      $http.put("http://localhost:8000/api/v1/bookinglines/"+$bookingline.id, updateBookingLine);
      //Mise a jour si nécessaire du status de la commande
      //Variable qui vérifie qu'il n'y a plus de statut "En cours"
      var validate=0;
      for (var i = $scope.booking.bookinglines.length - 1; i >= 0; i--) {
        if($scope.booking.bookinglines[i].status == "1")
          validate = -1;
      }
      if(validate==0){
        $scope.booking.statusName = "Validée";
        //Envoie de la mise a jour à la BDD
        var updateBooking = {};
        updateBooking.status = 2
        $http.put("http://localhost:8000/api/v1/bookings/"+$scope.booking.id, updateBooking)
      }
    }

    //Annuler un item
    $scope.cancelLine=function($bookingline){
      $bookingline.status = 4;
      $bookingline.statusName = "Annulé";
      var updateBookingLine = {};
      updateBookingLine.status = 4;
      $http.put("http://localhost:8000/api/v1/bookinglines/"+$bookingline.id, updateBookingLine);
      //Mise a jour si nécessaire du status de la commande
      //Variable qui vérifie qu'il n'y a plus de statut "En cours"
      var validate=0;
      //Variable qui vérifie qu'il n'y ait plus de statut "En cours et validé"
      var rendu = 0;
      //Variable qui vérifie qui compte le nombre de statut "Annulés"
      var cancel=0;
      for (var i = $scope.booking.bookinglines.length - 1; i >= 0; i--) {
        if($scope.booking.bookinglines[i].status == "1"){
          validate = -1;
          rendu=-1;
        }
        if($scope.booking.bookinglines[i].status == "2")
          rendu = -1;  
        if($scope.booking.bookinglines[i].status == "4")
          cancel++;
      }
      if($scope.booking.bookinglines.length == cancel){
        $scope.booking.statusName = "Annulée";
        //Envoie de la mise a jour à la BDD
        var updateBooking = {};
        updateBooking.status = 4
        $http.put("http://localhost:8000/api/v1/bookings/"+$scope.booking.id, updateBooking)
      }
      else if(rendu==0){
        $scope.booking.statusName = "Terminée";
        //Envoie de la mise a jour à la BDD
        var updateBooking = {};
        updateBooking.status = 3
        $http.put("http://localhost:8000/api/v1/bookings/"+$scope.booking.id, updateBooking)
      }
      else if(validate==0){
        $scope.booking.statusName = "Validée";
        //Envoie de la mise a jour à la BDD
        var updateBooking = {};
        updateBooking.status = 2
        $http.put("http://localhost:8000/api/v1/bookings/"+$scope.booking.id, updateBooking)
      }
    }

    //Item rendu
    $scope.getBack=function($bookingline){
      $bookingline.status = 3;
      $bookingline.statusName = "Rendu";
      var updateBookingLine = {};
      updateBookingLine.status = 3;
      $http.put("http://localhost:8000/api/v1/bookinglines/"+$bookingline.id, updateBookingLine);
      //Mise a jour si nécessaire du status de la commande
      //Variable qui vérifie qu'il n'y a plus de statut "En cours"
      var validate=0;
      //Variable qui vérifie qu'il n'y ait plus de statut "En cours et validé"
      var rendu = 0;
      for (var i = $scope.booking.bookinglines.length - 1; i >= 0; i--) {
        if($scope.booking.bookinglines[i].status == "1"){
          validate = -1;
          rendu=-1;
        }
        if($scope.booking.bookinglines[i].status == "2")
          rendu = -1;  
      }
      if(rendu==0){
        $scope.booking.statusName = "Terminée";
        console.log("la");
        //Envoie de la mise a jour à la BDD
        var updateBooking = {};
        updateBooking.status = 3
        $http.put("http://localhost:8000/api/v1/bookings/"+$scope.booking.id, updateBooking)
      }
      else if(validate==0){
        $scope.booking.statusName = "Validée";
        //Envoie de la mise a jour à la BDD
        var updateBooking = {};
        updateBooking.status = 2
        $http.put("http://localhost:8000/api/v1/bookings/"+$scope.booking.id, updateBooking)
      }
    }

  });

