'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('createBookingCtrl', function ($scope, serviceAjax, $routeParams, $location, $timeout, $filter, $rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Mail automatique envoyé à a la fin
    $scope.mail = {};

    //Emprunt
    $scope.booking = {}

    //Récupération de l'utilisateur
    $scope.user = $rootScope.auth.member;

    //Current date
    $scope.currentDate = new Date();
    console.log("date", $scope.currentDate);

    /*Chargement des associations d'un utilisateur*/
    var loadAssociations = function(){
    $scope.loading = true;
    serviceAjax.get("associations").then(function(data){
      //serviceAjax.get("userassos").then(function(data){
      $scope.assosBooking=data.data;
      console.log($scope.assosBooking);

      if($scope.assosBooking.length==1){
        $scope.booking.assoRequesting = $scope.assosBooking[0];
        loadAssociationsRequested();
      }
    });
    $scope.loading=false;
  }
  loadAssociations();

  //Fonction pour la sélection de l'association demandant un item
  $scope.assoRequesting = function($id){
    $scope.booking.assoRequesting = $scope.assosBooking.filter((r)=>r.id == $id)[0];
    console.log($scope.booking);
    //Chargement des associations hormis celles sélectionnées
    loadAssociationsRequested();
  }

  /*Chargement des associations d'un utilisateur*/
    var loadAssociationsRequested = function(){
    $scope.loading = true;
    serviceAjax.get("associations").then(function(data){
        $scope.assosRequested=data.data;

        //On retire l'association qui est déjà sélectionné en tant qu'emprunter
        for (var i = $scope.assosRequested.length - 1; i >= 0; i--) {
          if($scope.assosRequested[i].id==$scope.booking.assoRequesting.id){
            $scope.assosRequested.splice(i,1);
          }
        }
    });    
    $scope.loading=false;
  }
  
  //Fonction pour la sélection de l'association possédant les items à emprunter
  $scope.associationRequested = function($id){
    $scope.booking.assoRequested = $scope.assosRequested.filter((r)=>r.id == $id)[0];
    console.log("id", $scope.booking.assoRequested.id)
    loadItem($scope.booking.assoRequested.id);

    //Chargement des associations hormis celles sélectionnées
  }

  /***  ETAPE 3 ***/
  $scope.dateSave = function(){
    $scope.booking.date = true;
  }

  /***  ETAPE 4 ***/
  //Chargement des items en fonction de l'association sélectionnée
  //ATTENTION FAIRE REQUETE SANS CAUTION  //
  var loadItem = function($id){
    $scope.loading=true;
    serviceAjax.get("booking/items/" + $id).then(function(data){
      $scope.items = data.data;  
    });
    $scope.loading=false;
    
  }  

  //Items réservés 
  $scope.bookingline = {}
  $scope.bookingline.items = [];

  //Ajouter un item dans le panier en baissant la quantité d'items restantes
  $scope.addItem = function($item){
    //$scope.bboking
    $item.quantity--;

    var index = $scope.bookingline.items.map((p) => { return p.id; }).indexOf($item.id);
    if(index == -1) {
          $scope.bookingline.items.push({
              id: $item.id,
              name: $item.name,
              quantity: 1,
              startDateAngular : $scope.booking.startDate,
              endDateAngular : $scope.booking.endDate
          })
      }else {
          var itemBooked = $scope.bookingline.items[index];
          itemBooked.quantity += 1;
      }
  }

    /*** RESUME DE LA RESERVATION ***/

  //Modification de l'association demandant des items
  $scope.changeAssoRequesting = function(){
    $scope.booking.assoRequesting = null;
  }

  //Modification de l'association à qui des items sont demandés
  $scope.changeAssoRequested = function(){
    $scope.booking.assoRequested = null;
    $scope.bookingline.items = [];
  }

  //Fonction permettant d'ajouter dans le résumé de la réservation un item si le stock le permet (icone +)
  $scope.addItemByIndex = function($index){
    var itemBooked = $scope.bookingline.items[$index];
    var item = $scope.items.filter((r)=>r.id == itemBooked.id)[0];
      if(item.quantity > 0){
          item.quantity--;
          itemBooked.quantity++;
      }
  }

  //Fonction permettant dde diminuer dans le résumé de la réservation un item si le stock le permet (icone -)
  $scope.removeProductByIndex=function($index){
    var itemBooked = $scope.bookingline.items[$index];
    var item = $scope.items.filter((r)=>r.id == itemBooked.id)[0];
    item.quantity++;
    itemBooked.quantity--;
      if(itemBooked.quantity == 0){
          $scope.bookingline.items.splice($index, 1);
      }
  }

  //Modification de la date de départ du prêt d'un item
  $scope.editStartDate = function($item){
    $item.editStartDate = true; 
  }

  //Modification de la date de fin du prêt d'un item
  $scope.editEndDate = function($item){
    $item.editEndDate = true; 
  }

  //Validation de la commande
  $scope.save = function(){
    $scope.mail.comment = $scope.comment;
    $scope.booking.user = $scope.user.id;
    $scope.booking.owner = $scope.booking.assoRequested.id;
    $scope.booking.booker = $scope.booking.assoRequesting.id;
    $scope.booking.status = 1;
    $scope.booking.cautionReceived = false;
    serviceAjax.post("booking/validation/items", $scope.bookingline).then(function(data){
      $scope.booking.caution = data.data;
      serviceAjax.post('bookings', $scope.booking).then(function(data){
        $scope.callBackBooking = data.data;
        
        /* Envoi du mail automatique */
        $scope.mail.subject = "Demande de réservation - " + $scope.booking.assoRequested.name;
        $scope.mail.content = "L'association " + $scope.booking.assoRequesting.name + " vient de faire une demande de réservation de matériel à votre association." +  " En voici la liste :";
        $scope.mail.bookinglines = [];
        $scope.mail.association = $scope.booking.assoRequesting.name;
        var bookinglines = []
        var promises=[];

        for(var i = $scope.bookingline.items.length - 1; i >= 0; i--) {

          $scope.bookingline.items[i].startDate = $filter('date')($scope.bookingline.items[i].startDateAngular, "yyyy-MM-dd");
          $scope.bookingline.items[i].endDate = $filter('date')($scope.bookingline.items[i].endDateAngular, "yyyy-MM-dd");
          $scope.bookingline.items[i].item = $scope.bookingline.items[i].id;
          $scope.bookingline.items[i].booking = $scope.callBackBooking.id;
          $scope.bookingline.items[i].status = 1;

        }

        serviceAjax.post("bookinglines", $scope.bookingline).then(function(data){
          console.log("response", data.data);
          $scope.mail.bookinglines = data.data;
          console.log($scope.mail);
          //serviceAjax.post('send', $scope.mail);
          $location.path('/booking/' + $scope.callBackBooking.id);
        })
      });
    })
  }
});

