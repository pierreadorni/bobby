'use strict';

/**
 * @ngdoc function
 * @name bobbyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bobbyApp
 */
angular.module('bobbyApp')
  .controller('MyItemsCtrl', function ($scope, serviceAjax, $routeParams, $location, $http, $timeout, $window, $log, FileSaver) {

    /*$scope.previewSrc = null;
    $scope.product = {}

    $scope.$watch("product.pic", function(newV, oldV) {
      console.log("there");
        if(newV !== oldV && newV instanceof File) {
            $scope.previewSrc = $window.URL.createObjectURL(newV);
        }
    });*/

    /*Initialisation des boutons de confirmation*/
    $scope.addConfirmation = false;
    $scope.updateConfirmation = false;
    $scope.deleteConfirmation = false;

    $scope.asso_uid = $routeParams.asso_uid;

    var loadAssociation = function(){
      $scope.loading=true;
      serviceAjax.get("associations/"+$scope.asso_uid).then(function(data){
        $scope.asso = data.data.shortname;
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
      serviceAjax.get("association/items/"+$scope.asso_uid).then(function(data){
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
      $scope.newItem.association = $routeParams.asso_uid;
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
      $scope.loading=true;
      serviceAjax.post('items', $scope.newItem).then(function(){
        loadItem();
        $scope.addConfirmation = true;
        $timeout(function() {
           $scope.addConfirmation = false;
        }, 3000)
      })
      
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

