/**
 *  Gère l'authentification auprès de l'API
 */
app.factory('PortailAuth', function($http, $window, $location, $cookies, $q, $rootScope, serviceAjax){

  var factory = {};

  /**
   *  Authentifié ou non
   */
  factory.auth = false;

  /**
   *  Token
   */
  factory.token = null;

  /**
   *  Member
   */
  factory.member = {};

  /**
   *  Permissions
   */
  factory.permissions = null;

  /**
   *  Enregistre les variables auth et token dans un cookie
   */
  factory.saveCookie = function() {
      // Remove permissions, we don't need to save them into a cookie
      /*var member = factory.member;
      if (member.role)
        member.role.permissions = null;*/
      $cookies.putObject('PortailAuth',
          {
            'auth' : factory.auth,
            'token' : factory.token,
            'member' : factory.member,
          }
      );
  }

  /**
   *  Charge les variables auth et token depuis un cookie
   */
  factory.loadCookie = function() {
    if($cookies.getObject('PortailAuth')) {
      factory.auth = $cookies.getObject('PortailAuth').auth;
      factory.token = $cookies.getObject('PortailAuth').token;
      factory.member = $cookies.getObject('PortailAuth').member;
    }
  }

  /**
   *  Setter pour auth
   */
  factory.setAuth = function(auth) {
    factory.auth = auth;
    factory.saveCookie();
  }

  /**
   *  Setter pour token
   */
  factory.setToken = function(token){
    factory.token = token;
    factory.saveCookie();
  }

  /**
   *  Setter pour member
   */
  factory.setMember = function(member) {
    factory.member = member;
    factory.saveCookie();
  }

  /**
   *  Réinitialise auth et token
   */
  factory.clear = function() {
    factory.setAuth(false);
    factory.setToken('');
    factory.setMember({});
  }

    /**
     * Setter pour permissions
     * @param permissions
     */
  /*factory.setPermissions = function(permissions) {
    factory.permissions = permissions;
  }*/

    /**
     * Refresh permissions list from the server
     */
  /*factory.refreshPermissions = function () {

      var deferred = $q.defer();

      if (factory.auth) {
          Users.selfPermissions({}).$promise
              .then(function (data) {
                  factory.setPermissions(data.data);
                  deferred.resolve(data.data);
              }).catch(function (error) {
              deferred.reject(error);
          });
      } else {
          factory.setPermissions([]);
          deferred.resolve([]);
      }

      return deferred.promise;
  };*/

  //factory.deferred = null;

  // TODO : avoir proprement le role de l'utilisateur
  /*$rootScope.isExtern = function() {
      return $rootScope.auth.member.role_id == 8;
  }*/

    /**
     * Détermine si l'user courant a la permission attr
     * @param attr
     */
  /*$rootScope.can = function(attr) {
      if (factory.permissions == null) {
          if (factory.deferred == null) {
              factory.deferred = $q.defer();
              factory.refreshPermissions()
              .then(function () {
                  factory.deferred.resolve(factory.hasPermission(attr));
              }, function (error) {
                  factory.deferred.reject(error);
              });
          }

          return factory.deferred.promise;
      } else {
          return factory.hasPermission(attr);
      }
  }*/

    /**
     * Détermine si permission est dans la liste des permission de PortailAuth
     * @param permission
     * @returns {boolean}
     */
  /*factory.hasPermission = function (permission) {
      // Super admin is god
      // A FAIRE : remmettre tous les droits au superadmin après dev
      // if (permission != 'super-admin' && this.hasPermission('super-admin')) {
      //     return true;
      // }

      var res = false;
      angular.forEach(factory.permissions, function (perm) {
          if (perm.slug == permission) {
              res = true;
          }
      });
      return res;
  }*/

  /**
   *  Met à jour auth, token et member
   */
  factory.login = function(token) {
    factory.setToken(token);
    factory.setAuth(true);
    // Récupération des données du membre
    serviceAjax.get('user').then(function(data){
      factory.setMember(data.data);
    })
    /*var deferred = $q.defer();

    Users.self({}).$promise
    .then(function(data){
        factory.setMember(data.data);
        return factory.refreshPermissions();
    }).then(function (data) {
        deferred.resolve(data);
    }).catch(function (error) {
        deferred.reject(error);
    });

    return deferred.promise;*/
  }

  /**
   *  Vide auth et token
   */
  factory.logout = function() {
    factory.clear();
  }

  /**
   *  Redirige vers la page d'authentification du Portail
   */
  factory.goLogin = function() {
    //On lance loginController@code pour composer l'URL servant à récupérer le code 
    serviceAjax.get('code')
      .then(function(data){
        //Redirection pour récupérer le code
        //Redirection vers LoginController@login
        //=> Pour récupérer le token
        window.location.href = data.data["url"];
      });
  }

  /**
   *  Redirige vers la page de logout CAS
   */
  /*factory.goLogout = function() {
    $http.get(__ENV.apiUrl+'/logout')
      .success(function(data){
        factory.logout(); // On vide les infos auth et token de PortailAuth
        $window.location.href = data.url; // Vers le logout CAS
      }).error(function(error){
        // Gérer en cas d'erreur
      });
  }*/

  // Avant de retourner la factory, on récupère les informations dans le cookie,
  // s'il existe, sinon on le créé
  if($cookies.getObject('PortailAuth')) {
      factory.loadCookie();
      //factory.refreshPermissions();
  } else {
      factory.saveCookie();
  }

  return factory;
});

'use strict';

/**
 * @ngdoc service
 * @name bobbyApp.serviceAjax
 * @description
 * # serviceAjax
 * Factory in the bobbyApp.
 */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;

}

var csrftoken =  getCookie('csrftoken');

angular.module('bobbyApp')
  .factory('serviceAjax', function serviceAjax($http) {
        return{
            get: function(path){
                return $http.get(__ENV.apiUrl + '/' + path);
            },

            post: function(path, object){
                return $http.post(__ENV.apiUrl + '/' + path, object);
            },
            put: function(path, object){
                return $http.put(__ENV.apiUrl + '/' + path, object);
            },
            delete : function(path){
                return $http.delete(__ENV.apiUrl + '/' + path);
            }
        }
    });