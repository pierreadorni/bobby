/**
 * @ngdoc overview
 * @name bobbyApp
 * @description
 * # bobbyApp
 *
 * Main module of the application.
 */


/**
 *  Configuration de l'environnement
 */
var __ENV = window.__env;

/**
 * Enable console log when debug is true only
*/



var app  = angular
  .module('bobbyApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angular-toArrayFilter',
    'ngFileSaver',
    'angularMoment'
  ])
  .constant('__ENV', __ENV);
  


/**
 *  Initialisation de variables au niveau du $rootScope
 */
app.run(function($rootScope, PortailAuth) {

    // On stocke la factory d'authentification dans cette variable de $rootScope
    // De cette façon, la factory peut être accessible n'importe où (services, controllers, ...)
    // à la condition d'injecter $rootScope
    $rootScope.auth = PortailAuth;

});

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/components/dashboard/main.html',
        controller: 'MainCtrl'
      })
      .when('/items/:asso_uid', {
        templateUrl: 'app/components/items/my_items.html',
        controller: 'MyItemsCtrl',
        controllerAs: 'MyItems'
      })
      .when('/categories/:id', {
        templateUrl: 'app/components/categories/categories.html',
        controller: 'categorieCtrl',
        controllerAs: 'categorie'
      })
      .when('/booking',{
        templateUrl : 'app/components/bookings/create_booking.html',
        controller : 'createBookingCtrl',
        controllerAs : 'createBooking'
      })
      .when('/mybookings',{
        templateUrl : 'app/components/bookings/index_my_bookings.html',
        controller : 'indexMyBookingsCtrl',
        controllerAs : 'createBooking'
      })
      .when('/booking/:id',{
        templateUrl : 'app/components/bookings/edit_booking.html',
        controller : 'editBookingCtrl',
        controllerAs : 'editBooking'
      })
      .when('/gestion/categories', {
        templateUrl : 'app/components/categories/administrator/categories_management.html',
        controller : 'categoriesManagementCtrl',
        controllerAs : 'categoriesManagement'
      })
      .when('/gestion/places', {
        templateUrl : 'app/components/places/places_management.html',
        controller : 'placesManagementCtrl',
        controllerAs : 'placesManagement'
      })
      .when('/gestion/items',{
        templateUrl : 'app/components/items/administrator/index_items.html',
        controller : 'indexItemsCtrl',
        controllerAs : 'indexItems'
      })  
      .when('/gestion/bookings',{
        templateUrl : 'app/components/bookings/administrator/index_bookings.html',
        controller : 'indexBookingsCtrl',
        controllerAs : 'indexBookings'
      })      
      .when('/login',{
        templateUrl : 'app/components/login/login.html',
        controller : 'loginCtrl',
        controllerAs : 'login'
      }) 
      // Page de gestion des erreurs
      .when("/error/:code", {
        templateUrl : "app/components/errors/error.html"
      }) 
      .otherwise({
        redirectTo: '/'
      });
  });

 /**
*  Vérification de la connexion lors des changements de route
*/
app.run( function($rootScope, $location) {

  // Listener qui surveille le moindre changement de route
  $rootScope.$on("$routeChangeStart", function(event, next, current) {

    if ( !$rootScope.auth.auth ) { // L'utilisateur n'est pas connecté, on le redirige vers /login

      if ( next.templateUrl != "app/components/login/login.html"       // S'il se dirige déjà vers login, on ne le redirige pas
          && next.templateUrl != "app/components/errors/error.html") {  // S'il se dirige vers une page d'erreur, on ne le redirige pas
        $location.path("/login");
      }

    }
    else if ( next.templateUrl == "app/components/login/login.html" ) { // S'il est déjà connecté, on l'empêche d'aller sur login, redirection vers /
      $location.path( "/" );
    }

  });

});


/**
 *  Ajout d'un interceptor (~middleware) pour gérer les requêtes/réponses vers/de l'API
 */
app.config(['$httpProvider', function($httpProvider) {

  $httpProvider.interceptors.push(function($q, $rootScope, $location) {
    return {
      'request': function(config) { // Pour les rêquetes

        if ($rootScope.auth.auth) { // On vérifie que l'utilisateur est authentifié grâce à la factory

          // S'il est authentifié, on ajoute le header Authorization avec son token
          config.headers['Authorization'] = 'Bearer ' + $rootScope.auth.token;

        }

        return config;
      },
      'responseError': function (response) {  // Pour les réponses, en cas d'erreur (status!=200)

        if (response.status == 401) { // On traite le cas où l'on est pas authentifié auprès de l'API

          // On reset la factory d'authentification
          $rootScope.auth.clear();

          // On redirige vers la page de login, car on a un problème d'authentification
          $location.path("/login");

          // On empêche de traiter l'erreur avec ErrorHandler
          return true;

        }
        else if(response.status == 401 && $location.path() == "/login") { // Le cas où on revient sur login après un login

            $location.path("/error/401"); // L'utilisateur s'est identifié mais n'est pas autorisé, on le met sur la page d'erreur

        }

        return $q.reject(response);
      }
    };
  });
}]);


