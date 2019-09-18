/**
 *  Gère l'authentification auprès de l'API
 */
app.factory('PortailAuth', function($window, $cookies, $q, $rootScope, serviceAjax, localStorageService){

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

    localStorageService.set('auth', factory.auth);
    localStorageService.set('token', factory.token);
    localStorageService.set('member', factory.member);

      // $cookies.putObject('PortailAuth',
      //     {
      //       'auth' : factory.auth,
      //       'token' : factory.token,
      //       'member' : factory.member,
      //     }
      // );
  }

  /**
   *  Charge les variables auth et token depuis un cookie
   */
  factory.loadCookie = function() {
    factory.auth = localStorageService.get('auth');
    factory.token = localStorageService.get('token');
    factory.member = localStorageService.get('member');
    factory.refreshPermissions();
    // if($cookies.getObject('PortailAuth')) {
    //   factory.auth = $cookies.getObject('PortailAuth').auth;
    //   factory.token = $cookies.getObject('PortailAuth').token;
    //   factory.member = $cookies.getObject('PortailAuth').member;
    //   factory.refreshPermissions();
    // }
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
  factory.setPermissions = function(permissions) {
    factory.permissions = permissions;
  }

    /**
     * Refresh permissions list from the server
     */
  factory.refreshPermissions = function () {


      if (factory.auth) {
        serviceAjax.get('permissions').then(function(data){
          factory.setPermissions(data.data)
        })
      } else {
          factory.setPermissions([]);
      }

  };


  // Retourne vrai si un utilisateur est admin bobby
  
  factory.isAdmin = function() {
      return factory.permissions.includes('admin');
  }

  $rootScope.isAdmin = function(){
    return factory.isAdmin()
  }

  
  // Retourne vrai si un utilisateur est admin bobby pour une asso
  
  factory.isAdminAsso = function(login){
    return factory.permissions.includes(login + '-admin')
  }

  $rootScope.isAdminAsso = function(login){
    return factory.isAdminAsso(login)
  }

  // Retourne vrai si un utilisateur est admin dans au moins une asso
  factory.canBook = function(){
    return factory.permissions.some(function(item){return (new RegExp(/-admin/).test(item))})
  }

  $rootScope.canBook = function(){
    return factory.canBook()
  }


  // Retourne vrai si un utilisateur est membre d'une asso
  
  factory.isMemberAsso = function(login){
    return factory.permissions.includes(login)
  }

  $rootScope.isMemberAsso = function(login){
    return factory.isMemberAsso(login)
  }


  /**
   *  Met à jour auth, token et member
   */
  factory.login = function(token) {
    factory.setToken(token);
    factory.setAuth(true);
    // Récupération des données du membre
    serviceAjax.get('user').then(function(data){
      var user = data.data;
      factory.setMember(user);
      factory.refreshPermissions();
    })
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
  factory.goLogout = function() {
    serviceAjax.get('logout')
      .then(function(data){
        factory.logout(); // On vide les infos auth et token de PortailAuth
        $window.location.href = data.data.url; // Vers le logout CAS
      },function(error){
        // Gérer en cas d'erreur
      });
  }

  // Avant de retourner la factory, on récupère les informations dans le cookie,
  // s'il existe, sinon on le créé
  factory.loadCookie();

  return factory;
});
