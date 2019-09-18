'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('bugsManagementCtrl', function ($scope, serviceAjax, $location, $rootScope, $timeout, Data) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if(!$rootScope.isAdmin()){
      $location.path('/error/403');
    }

    $scope.error = false;
    $scope.deleteConfirmation = false;


    // Chargement des bugs
    var loadBugs = function(){
      $scope.loading = true;
      serviceAjax.get('bugs').then(function(res){
        $scope.bugs = res.data;
        for (let index = 0; index < $scope.bugs.length; index++) {
          $scope.bugs[index].loading = false;
        }
      })
    }
    loadBugs();

    
    $scope.delete = function(bug){
      $scope.loading = true;
      serviceAjax.delete('bugs/'+ bug.id).then(function(){
        $scope.bugs = $scope.bugs.filter((b) => b.id != bug.id);
        $scope.loading = false;
        $scope.deleteConfirmation = true;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
      }, function(){
        $scope.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
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
    $scope.mail.comment = $scope.comment;
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

      // TO DO 
      // Envoie du mail (voir avec Samy)
      
    }, function(error){
      $scope.error = true;
      $scope.loading = false;
      $timeout(function() {
        $scope.error = false;
      }, 20000)
    });
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

        //On vérifie que l'utilisateur est admin d'une association (déjà vérifié dans l'API) 
        // L'user peut etre admin
        if (!$rootScope.isAdmin()) {
          if (!$scope.booking.isAdminAsso($scope.booking.owner.login) && !$scope.booking.isAdminAsso($scope.booking.booker.login)) {
            $location.path('/error/403')
          }
        }  
        loadDates();       
      })
    }
    loadBookings();


    /* PARTIE INFORMATION GENERALE */

    //Remise de la caution
    $scope.cautionReceived = function(){
      $scope.booking.cautionReceived = "Oui";
      serviceAjax.post('bookings/caution/' + $scope.booking.id);
    }


    //Validation de tous les items de la commande
    $scope.acceptBooking = function(){
      serviceAjax.get("bookings/accept/" + $scope.booking_id).then(function(){
        serviceAjax.get("bookings/" + $scope.booking_id).then(function(res){
          $scope.booking = res.data;
          loadDates();
        })
      })
    }

    //Annulation de la réservation
    $scope.cancelBooking = function(){
      serviceAjax.get('bookings/cancel/' + $scope.booking.id, $scope.booking).then(function(){
        serviceAjax.get("bookings/" + $scope.booking_id).then(function(res){
          $scope.booking = res.data;
          loadDates();
        })
      })
    }

    //Validation du rendu du matériel pour tous les items
    $scope.returnedBooking = function(){
      serviceAjax.get('bookings/returned/' + $scope.booking.id, $scope.booking).then(function(){
        serviceAjax.get("bookings/" + $scope.booking_id).then(function(res){
          $scope.booking = res.data;
          loadDates();
        })
      })
    }


    /* PARTIE MATERIEL */

    //Editer un item
    $scope.edit=function($item){
      $item.edit = !$item.edit;
    }

    //Accepter un item
    $scope.acceptLine =function(bookingline){
      serviceAjax.get('bookinglines/accept/' + bookingline.id).then(function(res){
        bookingline.status = 2;
        bookingline.statusName = "Validé"
        // On vérifie que le statut général de la commande n'a pas changé
        serviceAjax.get('bookings/' + bookingline.booking).then(function(res){
          if ($scope.booking.status != res.data.status) {
            $scope.booking.status = res.data.status;
            $scope.booking.statusName = res.data.statusName;
          }
        })
      })
    }

    //Annuler un item
    $scope.cancelLine=function(bookingline){
      serviceAjax.get('bookinglines/cancel/' + bookingline.id).then(function(res){
        bookingline.status = 4;
        bookingline.statusName = "Annulé"
        // On vérifie que le statut général de la commande n'a pas changé
        serviceAjax.get('bookings/' + bookingline.booking).then(function(res){
          if ($scope.booking.status != res.data.status) {
            $scope.booking.status = res.data.status;
            $scope.booking.statusName = res.data.statusName;
          }
        })
      })
    }

    //Item rendu
    $scope.returnedLine=function(bookingline){
      serviceAjax.get('bookinglines/returned/' + bookingline.id).then(function(res){
        bookingline.status = 3;
        bookingline.statusName = "Rendu"
        // On vérifie que le statut général de la commande n'a pas changé
        serviceAjax.get('bookings/' + bookingline.booking).then(function(res){
          if ($scope.booking.status != res.data.status) {
            $scope.booking.status = res.data.status;
            $scope.booking.statusName = res.data.statusName;
          }
        })
      })
    }

    //Mise à jour d'un item et validation
    $scope.updateItem=function(item){
      item.startDate = $filter('date')(item.startDateAngular, "yyyy-MM-dd")
      item.endDate = $filter('date')(item.endDateAngular, "yyyy-MM-dd")
      serviceAjax.put("bookinglines/"+item.id, item).then(function(res){
        item.edit = false;
        if ($rootScope.isAdminAsso($scope.booking.owner.login)) {
          // Si c'est le propriétaire qui a fait la validation on valide l'item
          $scope.acceptLine(item);
        }
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
    $scope.status = 4;
    $scope.status2 = 4;

    $scope.changeStatus=function(nb){
      $scope.status = nb;
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

    $scope.loading = true;

    var checkLoading = function(){
      if (!$scope.loading_types && !$scope.loading_item) {
        $scope.loading = false;
      }
    }

     //Recherche de la catégorie séléectionné
    var loadCategorie = function(){
      $scope.loading_types = true;
      if($scope.categorie_id == 0){
        $scope.type = 'Totalité du matériel';
        $scope.loading_types = false;
      }
      else {
        serviceAjax.get("itemtypes/"+$scope.categorie_id).then(function(data){
          $scope.type = data.data.name;
          $scope.loading_types = false;
          checkLoading();
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
      $scope.loading_item = true;
      serviceAjax.get("items/categories/" + $scope.categorie_id)
        .then(function(data){
          $scope.items = data.data;
          $scope.loading_item = false;
          checkLoading();
        });
      
    };
    loadItem();

    // Redirection pour la demande de réservation
    $scope.bookItem = function(item){
      window.location.href = "#!/booking?item_id=" + item.id + "&asso_id=" + item.association_id
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
  .controller('MainCtrl', function ($scope, $rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    $scope.prenom = $rootScope.auth.member.firstname;

  });

app.controller('dataCtrl', function($scope, $rootScope, $location, Data, serviceAjax, FileSaver, $http) {

    
    // On vérifie que l'utilisateur est admin dans au moins une asso
    
    if (!$rootScope.canBook()) {
        $location.path('/error/403')
    }


    // Chargement realtifs aux associations de l'utilisateur

    $scope.assos = [];
    $scope.selectedAsso = {};

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
          $scope.selectedAsso = $scope.assos[0];
          //Pour empêcher le select des assos de s'afficher
          $scope.singleAssociation = true;
        }
        $scope.loading=false;
    }
    loadAssociations();

    $scope.selectAsso = function(asso){
        $scope.selectedAsso = asso;
    }


    // Navigation entre onglet Export et Import
  
    $scope.export = true;
    $scope.import = false;

    $scope.use = function(type){
        if (type == 'import') {
            $scope.import = true;
            $scope.export = false;
        } else if (type == 'export'){
            $scope.import = false;
            $scope.export = true;
        }
    }

    $scope.isActive = function(type){
        if (type == 'import') {
            return $scope.import;
        } else if (type == 'export'){
            return $scope.export;
        }
    }


    // Export

    $scope.download = function(){
        $http.get(__ENV.apiUrl + '/export/items/' + $scope.selectedAsso.id, {responseType : "blob"}).then(function(res){
            FileSaver.saveAs(res.data, 'inventaire.xlsx');
        });
    }

    // Import

});
  
app.controller('errorCtrl', function($scope, $routeParams, $location) {

  if ($routeParams.code && $routeParams.code == 401) { // Si l'utilisateur CAS n'était pas autorisé à accéder

    $scope.errorCode = 401;
    $scope.errorDesc = "Vous n'êtes pas autorisé à accéder à cette webapp.";

  }
  else if ($routeParams.code && $routeParams.code == 403) {

    $scope.errorCode = 403;
    $scope.errorDesc = "Action interdite";

  }
  else if ($routeParams.code && $routeParams.code == 404) {

    $scope.errorCode = 404;
    $scope.errorDesc = "Page demandée introuvable";

  }
  else if ($routeParams.code && $routeParams.code == 500) {

    $scope.errorCode = 500;
    $scope.errorDesc = "Une erreur est survenue.";

  }
  else {
    $location.path("/");
  }

});

app.controller('loginCtrl', function($scope, $location, $rootScope, $routeParams, Data, PortailAuth, serviceAjax) {


  $scope.message = "Connexion";

	
	//Url avec token?=
	if($routeParams.token){
		$rootScope.auth.login($routeParams.token)
		serviceAjax.get('userassos').then(function(res){
			Data.setUserAssos(res.data);
			serviceAjax.get('associations').then(function(res){
				Data.setAssociations(res.data);
				serviceAjax.get('itemplaces').then(function(res){
					Data.setItemPlaces(res.data);
					serviceAjax.get('itemtypes').then(function(res){
						Data.setItemTypes(res.data);
						$location.path("/");
						$location.url($location.path());  // Clear des paramètres
					})
				})
			})
		})
		
	}
	else if ($routeParams.error && $routeParams.error == 401) { // Si l'utilisateur CAS n'est pas autorisé à accéder

	    $scope.message = "Erreur de connexion";

	    // On redirige vers la page d'erreur 401
	    $location.path("/error/401");
	    $location.url($location.path());  // Clear des paramètres

	}

	else {
	  	PortailAuth.goLogin();
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
      if (item.name && item.place && item.type && item.quantity && item.association_id && item.status && item.caution) {
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


    /* EXPORT */
    $scope.export = function(){
        serviceAjax.get('export/items', {responseType : "blob"}).then(
        function(data){
           console.log(data)
          /*var excel = [];
          excel.push(data.data)
          console.log(data);*/
         /* var excel = new Blob(data, { type: 'text/plain;charset=utf-8' });
          console.log(excel)*/
          /*var data = new Blob([data.data]);
          FileSaver.saveAs(data, 'inventaire_'+$scope.asso+'.xlsx');*/
          /*var file = new File(data.data, "hello world.xlx");
FileSaver.saveAs(file);*/
            saveAs(data.data, 'inventaire_'+$scope.asso+'.xlsx');
        });
    }

    /* IMPORT */

    //$scope.file = null;

    $scope.readImport = function(){
      $scope.import=true;
    }

    /* Fonctoin faisant appel a la bibliothèque Papaparse, appel asynchrone => utilisation de Promise */
    function parse(file) {
      var deferred = $q.defer();
      config = {
        header: false,
        dynamicTyping: true,
        encoding: "ISO-8859-1"
      }
      config.complete = function onComplete(result) {
        if (config.rejectOnError && result.errors.length) {
          deferred.reject(result);
          return;
        }
        deferred.resolve(result);
      };
      config.error = function onError(error) {
        deferred.reject(error);
      };
      Papa.parse(file, config);
      return deferred.promise;
    }


    $scope.csvParse = function(){
      var file = $scope.file;
      console.log(file);

      if(file instanceof File){
        parse($scope.file).then(function(data){
          console.log(data);
          //$scope.csvLines = data.data;
          /*$scope.items = {};
          $scope.items.data = [];
          $scope.headers = {};
          $scope.headers.data = [];
          console.log($scope.type)
          
          switch($scope.type){
            case 'products' :
                $scope.items.data = Csv.products($scope.csvLines)
                $scope.headers.data = Csv.productsHeader();
                break;
            case 'engines' :
                $scope.items.data = Csv.engines($scope.csvLines)
                $scope.headers.data = Csv.enginesHeader();
                break;
            case 'tools' :
                $scope.items.data = Csv.tools($scope.csvLines)
                $scope.headers.data = Csv.toolsHeader();
                break;
            case 'expendables' :
                $scope.items.data = Csv.expendables($scope.csvLines)
                $scope.headers.data = Csv.expendablesHeader();
                break;
          }*/

          //console.log($scope.items)
          //console.log($scope.headers)
          
          
        });
      }
    }

  });


app.controller('logoutCtrl', function($scope, PortailAuth) {


    $scope.message = "Déconnexion";
  
    PortailAuth.goLogout();
    
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
  .controller('placesManagementCtrl', function ($scope, serviceAjax, $location, $rootScope, $timeout, Data) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if(!$rootScope.isAdmin()){
      $location.path('/error/403');
    }

    /*Initialisation des boutons de confirmation*/
    $scope.addConfirmation = false;
    $scope.updateConfirmation = false;
    $scope.deleteConfirmation = false;
    $scope.error = false;
    $scope.inputErrors = "";

    //Pour afficher le formulaire d'ajout d'une nouvelle catégorie
    $scope.addNewPlace = false;
    $scope.newPlaceLoading = false;
    
    var loadNewPlace = function(){
      //Pour remplir la nouvelle catégorie
      $scope.newPlace = {};
    }

    loadNewPlace();


     //Recherche de la catégorie séléectionné
    var loadPlace = function(){
      $scope.loading = true;
      $scope.places = Data.loadItemPlaces();
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

    $scope.update = function(place){
      place.loading = true;
      serviceAjax.put('itemplaces/'+ place.id, place).then(function(){
        place.edit = !place.edit;
        place.loading = false;
        $scope.updateConfirmation = true;
        $timeout(function() {
           $scope.updateConfirmation = false;
        }, 3000);
        // Mise à jour Data Factory
        serviceAjax.get('itemplaces').then(function(res){
          Data.setItemPlaces(res.data);
        })
      }, function(error){
        if (error.status == 422) {
          $scope.inputErrors = error.data.errors;
        }
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
        place.loading = false;
      })
    }

    $scope.cancel = function(){
      $scope.addNewPlace = false;
      loadNewPlace();
    }

    $scope.cancelPlace = function(place){
      let index = $scope.places.findIndex((p) => p.id === place.id);
      place.loading = true;
      serviceAjax.get('itemplaces/' + place.id).then(function(res){
        $scope.places[index] = res.data;
      }, function(error){
        place.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
      })
    }

    $scope.save = function(){
      $scope.newPlaceLoading=true;
      serviceAjax.post('itemplaces', $scope.newPlace).then(function(res){
        $scope.places.push(res.data);
        $scope.addConfirmation = true;
        $scope.newPlaceLoading=false;
        $scope.addNewPlace = false;
        loadNewPlace();
        $timeout(function() {
           $scope.addConfirmation = false;
        }, 3000)
        // Mise à jour Data Factory
        serviceAjax.get('itemplaces').then(function(res){
          Data.setItemPlaces(res.data);
        })
      }, function(error){
        if (error.status == 422) {
          $scope.inputErrors = error.data.errors;
        }
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
        $scope.newPlaceLoading = false;
      })
      
    }


    $scope.setDeleteAttribute = function(place){
      $scope.elementToDelete = place;
    }

    $scope.delete = function(){
      const place = $scope.elementToDelete
      place.loading = true;
      serviceAjax.delete('itemplaces/'+ place.id).then(function(){
        $scope.places = $scope.places.filter((p) => p.id != place.id);
        $scope.deleteConfirmation = true;
        place.loading = false;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
        // Mise à jour Data Factory
        serviceAjax.get('itemplaces').then(function(res){
          Data.setItemPlaces(res.data);
        })
      }, function(){
        place.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
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
  .controller('indexBookingsCtrl', function ($scope, serviceAjax, $location, $rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if(!$rootScope.isAdmin()){
      $location.path('/error/403');
    }

     //Recherche de la catégorie séléectionné
    var loadBookings = function(){
      $scope.loading = true;
      serviceAjax.get("bookings").then(function(data){
        $scope.bookings = data.data;
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
  .controller('categoriesManagementCtrl', function ($scope, serviceAjax, $rootScope, $timeout, Data) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if(!$rootScope.isAdmin()){
      $location.path('/error/403');
    }

    /*Initialisation des boutons de confirmation*/
    $scope.addConfirmation = false;
    $scope.updateConfirmation = false;
    $scope.deleteConfirmation = false;
    $scope.error = false;
    $scope.inputErrors = "";

    //Pour afficher le formulaire d'ajout d'une nouvelle catégorie
    $scope.addNewCategorie = false;
    $scope.newCategorieLoading = false;
    
    var loadNewCategorie = function(){
      //Pour remplir la nouvelle catégorie
      $scope.newCategorie = {};
    }

    loadNewCategorie();


     //Recherche de la catégorie séléectionné
    var loadCategorie = function(){
      $scope.loading = true;
      $scope.categories = Data.loadItemTypes();
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

    $scope.edit = function(categorie){
      categorie.edit=!categorie.edit;
    }

    $scope.update = function(categorie){
      categorie.loading = true;
      serviceAjax.put('itemtypes/'+ categorie.id, categorie).then(function(){
        categorie.edit = !categorie.edit;
        $scope.updateConfirmation = true;
        categorie.loading = false;
        $timeout(function() {
           $scope.updateConfirmation = false;
        }, 3000)
        // Mise à jour Data Factory
        serviceAjax.get('itemtypes').then(function(res){
          Data.setItemTypes(res.data);
        })
      }, function(error){
        categorie.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
        if (error.status == 422) {
          $scope.inputErrors = error.data.errors;
        }
      })
    }

    $scope.cancel = function(){
      $scope.addNewCategorie = false;
      loadNewCategorie();
    }

    $scope.cancelCategorie = function(categorie){
      let index = $scope.categories.findIndex((c) => c.id === categorie.id);
      categorie.loading = true;
      serviceAjax.get('itemtypes/' + categorie.id).then(function(res){
        $scope.categories[index] = res.data;
      }, function(error){
        categorie.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
      })
    }

    $scope.save = function(){
      $scope.newCategorieLoading=true;
      serviceAjax.post('itemtypes', $scope.newCategorie).then(function(res){
        $scope.categories.push(res.data);
        $scope.addNewCategorie = false;
        $scope.addConfirmation = true;
        $scope.newCategorieLoading = false;
        loadNewCategorie();
        $timeout(function() {
           $scope.addConfirmation = false;
        }, 3000)
        // Mise à jour Data Factory
        serviceAjax.get('itemtypes').then(function(res){
          Data.setItemTypes(res.data);
        })
      }, function(error){
        if (error.status == 422) {
          $scope.inputErrors = error.data.errors;
        }
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
        $scope.newCategorieLoading = false;
      })
    }

    $scope.setDeleteAttribute = function(type){
      $scope.elementToDelete = type;
    }

    $scope.delete = function(){
      const categorie = $scope.elementToDelete;
      categorie.loading = true;
      serviceAjax.delete('itemtypes/'+ categorie.id).then(function(){
        categorie.loading = false;
        $scope.categories = $scope.categories.filter((c) => c.id != categorie.id);
        $scope.deleteConfirmation = true;
        $timeout(function() {
           $scope.deleteConfirmation = false;
        }, 3000)
        // Mise à jour Data Factory
        serviceAjax.get('itemtypes').then(function(res){
          Data.setItemTypes(res.data);
        })
      }, function(error){
        categorie.loading = false;
        $scope.error = true;
        $timeout(function() {
          $scope.error = false;
        }, 20000)
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
  .controller('indexItemsCtrl', function ($scope, serviceAjax, $location, $rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if(!$rootScope.isAdmin()){
      $location.path('/error/403');
    }

    $scope.items = []


     //Recherche de la catégorie séléectionné
    var loadItems = function(){
      $scope.loading = true;
      serviceAjax.get("items").then(function(data){
        $scope.items = data.data;
      })
    }
    loadItems();

    /* Tri des catégories */
    $scope.reverse = false;

    $scope.sort = function() {
      $scope.reverse = !$scope.reverse;
    };

  });

