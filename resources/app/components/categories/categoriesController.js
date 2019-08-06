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
