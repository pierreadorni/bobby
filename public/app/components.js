'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('createBookingCtrl', function ($scope, serviceAjax, $routeParams, $location, $http, focusMe, $timeout, $filter, $q) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Mail automatique envoyé à a la fin
    $scope.mail = {};

    //Emprunt
    $scope.booking = {}

    //Current date
    $scope.currentDate = new Date();
    console.log("date", $scope.currentDate);

    /*Chargement des associations d'un utilisateur*/
    var loadAssociations = function(){
    $scope.loading = true;
    serviceAjax.get("associations").then(function(data){
        $scope.assosBooking=data.data;

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
    loadItem($scope.booking.assoRequested.id);
    //Chargement des associations hormis celles sélectionnées
  }

  /***  ETAPE 3 ***/
  $scope.dateSave = function(){
    $scope.booking.date = true;
  }

  /***  ETAPE 4 ***/
  //Chargement des items en fonction de l'association sélectionnée
  //ATTENTION FAIRE REQUETE SANS CAUTION ETC //
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
      console.log($scope.bookingline.items);
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
      console.log($scope.comment);
      console.log('com1', $scope.mail.comment)
      $scope.booking.user = 1;
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
              serviceAjax.post('send', $scope.mail);
            })
        });
      })
    }
  });


'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('editBookingCtrl', function ($scope, $routeParams, serviceAjax, $location, $filter, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Current date
    $scope.currentDate = new Date();

    $scope.booking_id = $routeParams.id;

     //Recherche de la catégorie séléectionné
    var loadBookings = function(){
      $scope.loading = true;
      serviceAjax.get("bookings/" + $scope.booking_id).then(function(data){
        $scope.booking = data.data;
        console.log("donnees", $scope.booking)
      })
    }
    loadBookings();

    /* PARTIE INFORMATION GENERALE */

    //Remise de la caution
    $scope.changeCaution =function(){
      $scope.booking.cautionReceived = "Oui";
      var booking = {};
      booking.cautionReceived = true;
      serviceAjax.put("bookings/" + $scope.booking.id, booking);
    }

    //Validation de tous les items
    $scope.acceptAll=function(){
      serviceAjax.get("bookings/" + $scope.booking_id).then(function(data){
        $scope.booking = data.data;
        console.log("donnees", $scope.booking)
        $scope.booking.statusName="Validée";
        $scope.booking.status = "2";
        for (var i = $scope.booking.bookinglines.length - 1; i >= 0; i--) {
          if($scope.booking.bookinglines[i].status==1)
            $scope.accept($scope.booking.bookinglines[i]);
        }
      })
    }

    //Annulation de la réservation
    $scope.cancelBooking=function(){
      for (var i = $scope.booking.bookinglines.length - 1; i >= 0; i--) {
          $scope.cancelLine($scope.booking.bookinglines[i]);
      }
      $scope.booking.status = "4";
      $scope.booking.statusName = "Annulée";
    }

    //Validation du rendu du matériel pour tous les items
    $scope.getBackAll=function(){
      serviceAjax.get("bookings/" + $scope.booking_id).then(function(data){
        $scope.booking = data.data;
        console.log("donnees", $scope.booking)
        $scope.booking.statusName="Terminée";
        $scope.booking.status = "3";
        for (var i = $scope.booking.bookinglines.length - 1; i >= 0; i--) {
          if($scope.booking.bookinglines[i].status==2)
            $scope.getBack($scope.booking.bookinglines[i]);
        }
      })
    }


    /* PARTIE MATERIEL */

    //Editer un item
    $scope.edit=function($item){
      $item.edit = !$item.edit;
    }

    //Accepter un item
    $scope.accept=function($bookingline){
      $bookingline.status = 2;
      $bookingline.statusName = "Validé";
      var updateBookingLine = {};
      updateBookingLine.status = 2;
      serviceAjax.put("bookinglines/"+$bookingline.id, updateBookingLine);
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
        serviceAjax.put("bookings/"+$scope.booking.id, updateBooking)
      }
    }

    //Annuler un item
    $scope.cancelLine=function($bookingline){
      $bookingline.status = 4;
      $bookingline.statusName = "Annulé";
      var updateBookingLine = {};
      updateBookingLine.status = 4;
      serviceAjax.put("bookinglines/"+$bookingline.id, updateBookingLine);
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
        serviceAjax.put("bookings/"+$scope.booking.id, updateBooking)
      }
      else if(rendu==0){
        $scope.booking.statusName = "Terminée";
        //Envoie de la mise a jour à la BDD
        var updateBooking = {};
        updateBooking.status = 3
        serviceAjax.put("bookings/"+$scope.booking.id, updateBooking)
      }
      else if(validate==0){
        $scope.booking.statusName = "Validée";
        //Envoie de la mise a jour à la BDD
        var updateBooking = {};
        updateBooking.status = 2
        serviceAjax.put("bookings/"+$scope.booking.id, updateBooking)
      }
    }

    //Item rendu
    $scope.getBack=function($bookingline){
      $bookingline.status = 3;
      $bookingline.statusName = "Rendu";
      var updateBookingLine = {};
      updateBookingLine.status = 3;
      serviceAjax.put("bookinglines/"+$bookingline.id, updateBookingLine);
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
        serviceAjax.put("bookings/"+$scope.booking.id, updateBooking)
      }
      else if(validate==0){
        $scope.booking.statusName = "Validée";
        //Envoie de la mise a jour à la BDD
        var updateBooking = {};
        updateBooking.status = 2
        serviceAjax.put("bookings/"+$scope.booking.id, updateBooking)
      }
    }

    //Mise à jour d'un item et validation
    $scope.update=function($item){
      var bookingline = {}
      bookingline.status = 2;
      $item.edit = false;
      bookingline.quantity = $item.quantity;
      $scope.startDate = $item.startDate;
      $scope.endDate = $item.endDate;
      bookingline.startDate = $filter('date')($scope.startDate, "yyyy-MM-dd");
      bookingline.endDate = $filter('date')($scope.endDate, "yyyy-MM-dd");
      serviceAjax.put("bookinglines/"+$item.id, bookingline).then(function(){
        $item.status = "2";
        $item.statusName = "Validé";
        $item.edit = false;
      })
    }

  });


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

  });


'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('categorieCtrl', function ($scope, serviceAjax, $routeParams, $location, $http, $rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.categorie_id = $routeParams.id;

     //Recherche de la catégorie séléectionné
    var loadCategorie = function(){
      $scope.loading = true;
      if($scope.categorie_id == 0){
        $scope.type = 'Totalité du matériel';
      }
      else {
        serviceAjax.get("itemtypes/"+$scope.categorie_id).then(function(data){
        $scope.type = data.data.name;
        });
      }
    }
    loadCategorie();

    /* Gestion des tries des items*/
    $scope.propertyName = 'name';
    $scope.reverse = false;

    $scope.sortBy = function(propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
    };
    
    
    //Chargement des items en fonction de la catégorie sélectionnée

    var loadItem = function(){
      $scope.loading=true;
      serviceAjax.get("items/categories/" + $scope.categorie_id)
        .then(function(data){
          $scope.items = data.data;
        });
      $scope.loading=false;
    };
    loadItem();

  });


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
      serviceAjax.put('items/'+ $item.id, $item).then(function(){
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
      serviceAjax.post('items', $scope.newItem).then(function(){
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
      serviceAjax.delete('items/'+ $item.id).then(function(){
        loadItem();
        $scope.deleteConfirmation = true;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
      })

    }

  });


app.controller('loginCtrl', function($scope, $location, $rootScope, $routeParams, serviceAjax, $http) {


  $scope.message = "Connexion";

  $http.get('http://localhost:8000/api/v1/login').then(function(data){
   window.location.href = data.data['url'];
  })
});

'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('placesManagementCtrl', function ($scope, serviceAjax, $location, $http, focusMe, $timeout) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    /*Initialisation des boutons de confirmation*/
    $scope.addConfirmation = false;
    $scope.updateConfirmation = false;
    $scope.deleteConfirmation = false;

    //Pour afficher le formulaire d'ajout d'une nouvelle catégorie
    $scope.addNewPlace = false;
    
    var loadNewPlace = function(){
      //Pour remplir la nouvelle catégorie
      $scope.newPlace = {};
    }

    loadNewPlace();


     //Recherche de la catégorie séléectionné
    var loadPlace = function(){
      $scope.loading = true;
      serviceAjax.get("itemplaces").then(function(data){
        $scope.places = data.data;
      })
    }
    loadPlace();

    /* Tri des catégories */
    $scope.reverse = false;

    $scope.sort = function() {
      $scope.reverse = !$scope.reverse;
    };

    /* Fonctions de gestions des catégories*/

    $scope.add = function(){
      $scope.addNewPlace = true;
      $scope.focusInput = true;
    }

    $scope.edit = function($place){
      $place.edit=!$place.edit;
    }

    $scope.update = function($place){
      serviceAjax.put('itemplaces/'+ $place.id, $place).then(function(){
        $place.edit = !$place.edit;
        $scope.updateConfirmation = true;
        $timeout(function() {
           $scope.updateConfirmation = false;
        }, 3000);
      })
    }

    $scope.cancel = function(){
      $scope.addNewPlace = false;
      loadPlace();
    }

    $scope.save = function(){
      $scope.loading=true;
      console.log($scope.newPlace)
      serviceAjax.post('itemplaces', $scope.newPlace).then(function(){
        loadPlace();
        $scope.addConfirmation = true;
        $timeout(function() {
           $scope.addConfirmation = false;
        }, 3000)
      })
      $scope.loading=false;
      $scope.addNewPlace = false;
      loadNewPlace();
    }



    $scope.delete = function($place){
      serviceAjax.delete('itemplaces/'+ $place.id).then(function(){
        loadPlace();
        $scope.deleteConfirmation = true;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
      })

    }

  });


'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('indexBookingsCtrl', function ($scope, serviceAjax, $location) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

     //Recherche de la catégorie séléectionné
    var loadBookings = function(){
      $scope.loading = true;
      serviceAjax.get("bookings").then(function(data){
        $scope.bookings = data.data;
        console.log($scope.bookings)
      })
    }
    loadBookings();

    /* Gestion des tries des items*/
    $scope.propertyName = 'booker.name';
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


'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('categoriesManagementCtrl', function ($scope, serviceAjax, $location, $http, focusMe, $timeout) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    /*Initialisation des boutons de confirmation*/
    $scope.addConfirmation = false;
    $scope.updateConfirmation = false;
    $scope.deleteConfirmation = false;

    //Pour afficher le formulaire d'ajout d'une nouvelle catégorie
    $scope.addNewCategorie = false;
    
    var loadNewCategorie = function(){
      //Pour remplir la nouvelle catégorie
      $scope.newCategorie = {};
    }

    loadNewCategorie();


     //Recherche de la catégorie séléectionné
    var loadCategorie = function(){
      $scope.loading = true;
      serviceAjax.get("itemtypes").then(function(data){
        $scope.categories = data.data;
      })
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

    $scope.edit = function($categorie){
      $categorie.edit=!$categorie.edit;
    }

    $scope.update = function($categorie){
      serviceAjax.put('itemtypes/'+ $categorie.id, $categorie).then(function(){
        $categorie.edit = !$categorie.edit;
        $scope.updateConfirmation = true;
        $timeout(function() {
           $scope.updateConfirmation = false;
        }, 3000)
      })
    }

    $scope.cancel = function(){
      $scope.addNewCategorie = false;
      loadCategorie();
    }

    $scope.save = function(){
      $scope.loading=true;
      serviceAjax.post('itemtypes', $scope.newCategorie).then(function(){
        loadCategorie();
        $scope.addNewCategorie = false;
        $scope.addConfirmation = true;
        $timeout(function() {
           $scope.addConfirmation = false;
        }, 3000)
      })
      $scope.loading=false;
      
      loadNewCategorie();
    }



    $scope.delete = function($categorie){
      serviceAjax.delete('itemtypes/'+ $categorie.id).then(function(){
        loadCategorie();
        $scope.deleteConfirmation = true;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
      })

    }

  });


