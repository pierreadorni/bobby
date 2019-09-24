'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('createBookingCtrl', function ($scope, serviceAjax, $routeParams, $location, Data, $filter, $rootScope, $timeout) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if (!$rootScope.canBook()) {
      $location.path('/error/403')
    }

    //Mail automatique envoyé à a la fin
    $scope.mail = {};

    //Emprunt
    $scope.booking = {}

    // Champ recherche
    $scope.search = ""

    //Récupération de l'utilisateur
    $scope.user = $rootScope.auth.member;

    //Current date
    $scope.currentDate = new Date();

    // Erreur
    $scope.error = false;

    $scope.emailSending = false;

    /*Chargement des associations d'un utilisateur*/
    var loadAssociationsRequested = function(){
      $scope.loading = true;
      $scope.assosRequested=Data.loadAssociations();   
      $scope.loading=false;
    }


    /*Chargement des associations d'un utilisateur*/
    var loadAssociations = function(){
      $scope.loading = true;
      const userassos = Data.loadUserAssos();
      // $scope.assosBooking = data.data
      $scope.assosBooking=[];
      for (var i = userassos.length - 1; i >= 0; i--) {
        if ($rootScope.isAdminAsso(userassos[i].login)) {
          $scope.assosBooking.push(userassos[i])
        } 
      }

      if($scope.assosBooking.length==1){
        $scope.booking.assoRequesting = $scope.assosBooking[0];
      }
      loadAssociationsRequested();
    }

    // Utilisation rootparams pour récupérer l'item et l'asso à qui l'item appartient
    if ($routeParams.asso_id && $routeParams.item_id) {
      const asso_id = $routeParams.asso_id;
      const item_id = $routeParams.item_id;

      serviceAjax.get("associations/" + asso_id).then(function(res){
      $scope.booking.assoRequested = Data.loadAssociations();
      serviceAjax.get("booking/items/" + asso_id).then(function(res){
        $scope.items = res.data;
        const requested_item = $scope.items.filter((i) => i.id == item_id)[0];
        if (requested_item) {
          const booking_item = {
            'id': requested_item.id,
            'name': requested_item.name,
            'quantity': 1
          }
          $scope.bookingline.items.push(booking_item);
        }
        loadAssociations();
      }, function(error){
        loadAssociations();
      })
    }, function(error){
        loadAssociations();
      })
    } else {
      loadAssociations();
    }

    

  //Fonction pour la sélection de l'association demandant un item
  $scope.assoRequesting = function($id){
    $scope.booking.assoRequesting = $scope.assosBooking.filter((r)=>r.id == $id)[0];
    $scope.search = null
  }

  
  //Fonction pour la sélection de l'association possédant les items à emprunter
  $scope.associationRequested = function($id){
    $scope.booking.assoRequested = $scope.assosRequested.filter((r)=>r.id == $id)[0];
    $scope.search = null
    loadItem($scope.booking.assoRequested.id);

    //Chargement des associations hormis celles sélectionnées
  }

  /***  ETAPE 3 ***/
  $scope.dateSave = function(){
    $scope.booking.date = true;
    for (let index = 0; index < $scope.bookingline.items.length; index++) {
      $scope.bookingline.items[index].startDateAngular = $scope.booking.startDate;
      $scope.bookingline.items[index].endDateAngular = $scope.booking.endDate;      
    }
  }

  /***  ETAPE 4 ***/
  //Chargement des items en fonction de l'association sélectionnée
  //ATTENTION FAIRE REQUETE SANS CAUTION  //
  var loadItem = function($id){
    $scope.loading=true;
    serviceAjax.get("booking/items/" + $id).then(function(data){
      $scope.items = data.data;  
      $scope.loading=false;
    }, function(error){
      $scope.error = true;
      $scope.loading = false;
      $timeout(function() {
        $scope.error = false;
      }, 20000)
    });
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
      } else {
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
    $scope.emailSending = true;
    $scope.booking.user = $scope.user.id;
    $scope.booking.owner = $scope.booking.assoRequested.id;
    $scope.booking.booker = $scope.booking.assoRequesting.id;
    $scope.booking.status = 1;
    $scope.booking.cautionReceived = false;

    for(var i = $scope.bookingline.items.length - 1; i >= 0; i--) {

      $scope.bookingline.items[i].startDate = $filter('date')($scope.bookingline.items[i].startDateAngular, "yyyy-MM-dd");
      $scope.bookingline.items[i].endDate = $filter('date')($scope.bookingline.items[i].endDateAngular, "yyyy-MM-dd");
      $scope.bookingline.items[i].item = $scope.bookingline.items[i].id;
      // $scope.bookingline.items[i].booking = $scope.callBackBooking.id;
      $scope.bookingline.items[i].status = 1;

    }

    $scope.booking.bookingline = $scope.bookingline;

    serviceAjax.post('bookings', $scope.booking).then(function(data){
      $scope.callBackBooking = data.data;
      $location.path('/booking/' + $scope.callBackBooking.id);
    }, function(error){
      $scope.error = true;
      $scope.emailSending = false;
      $timeout(function() {
        $scope.error = false;
        $scope.emailSending = false;
      }, 20000)
    });
  }
});

