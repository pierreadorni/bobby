app.controller('dataCtrl', function($scope, $rootScope, $location, Data, serviceAjax, FileSaver, $http, $q) {

    
    // On vérifie que l'utilisateur est admin dans au moins une asso
    
    if (!$rootScope.canBook()) {
        $location.path('/error/403')
    }


    // Chargement realtifs aux associations de l'utilisateur

    $scope.assos = [];
    $scope.data = {}
    $scope.selected_asso = {}
    $scope.singleAssociation = false;
    $scope.selected_asso = {}

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

        /*S'il y a des associations la première est sélectionnée par défaut*/
        if($scope.assos.length>=1){
            $scope.selected_asso = $scope.assos[0];
            // Dans le cas où il y a une seule association exactement on empêche la sélection
            if ($scope.assos.length == 1) {
                $scope.singleAssociation = true;
            }
        }
        $scope.loading=false;
    }
    loadAssociations();

    $scope.types = Data.loadItemTypes();
    $scope.places = Data.loadItemPlaces();


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
        if ($scope.selected_asso.id) {
            $http.get(__ENV.apiUrl + '/export/items/' + $scope.selected_asso.id, {responseType : "blob"}).then(function(res){
                FileSaver.saveAs(res.data, 'inventaire.xlsx');
            });  
        }
    }

    // Import


    /* Fonctoin faisant appel a la bibliothèque Papaparse, appel asynchrone => utilisation de Promise */
    function parse(file) {
        var deferred = $q.defer();
        const config = {
            header: false,
            dynamicTyping: true,
            encoding : "UTF8"
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
        var file = $scope.data.file;

        if(file instanceof File){
            parse(file).then(function(res){
                const csvLines = res.data;
                $scope.data.headers = ['Nom', 'Quantité', 'Statut', 'Caution', 'Catégorie', 'Localisation'];

                var items = [];
                for (var i = 1; i < csvLines.length - 1 ; i++){
                    items[i-1] = {}
                    items[i-1].name = csvLines[i][0]
                    items[i-1].quantity = csvLines[i][1]
                    items[i-1].status = csvLines[i][2]
                    items[i-1].caution = csvLines[i][3]
                    items[i-1].typeName = csvLines[i][4]
                    items[i-1].placeName = csvLines[i][5]
                }
                $scope.data.parsed = true;
                $scope.data.items = items;
            });
        }
    }

    $scope.csvSave = function(){

        let errors = [];

        for (let index = 0; index < $scope.data.items.length; index++) {
            const element = $scope.data.items[index];

            if (!element.name) {
                errors.push("La propriété nom de l'élément n°" + (index+1) + " est requise.");
            }
            if (!element.quantity) {
                errors.push("La propriété quantité de l'élément n°" + (index+1) + " est requise.");
            } else if (!angular.isNumber(element.quantity)){
                errors.push("La propriété quantité de l'élément n°" + (index+1) + " doit être un entier.");
            }
            const status = ['1','2','3'];

            if (!element.status) {
                errors.push("La propriété statut de l'élément n°" + (index+1) + " est requise.");
            } else if (!status.find(value => value == element.status)){
                errors.push("La propriété statut de l'élément n°" + (index+1) + " ne respecte pas les règles définies au dessus.");
            }
            if (element.caution===null) {
                errors.push("La propriété caution de l'élément n°" + (index+1) + " est requise.");
            } else if (!angular.isNumber(element.caution)){
                errors.push("La propriété caution de l'élément n°" + (index+1) + " doit être un entier.");
            }
            if (!element.typeName) {
                errors.push("La propriété catégorie de l'élément n°" + (index+1) + " est requise.");
            } else if (!$scope.types.find(type => type.normalized_name == element.typeName)){
                errors.push("La propriété catégorie de l'élément n°" + (index+1) + " ne respecte pas les règles définies au dessus.");
            }
            if (!element.placeName) {
                errors.push("La propriété localisation de l'élément n°" + (index+1) + " est requise");
            } else if (!$scope.places.find(place => place.normalized_name == element.placeName)){
                errors.push("La propriété localisation de l'élément n°" + (index+1) + " ne respecte pas les règles définies au dessus.");
            }
            
        }
        $scope.data.checked = true;
        $scope.data.errors = errors;
    }


    $scope.csvImport = function(){
        serviceAjax.post('import/items/' + $scope.selected_asso.id, {'items': $scope.data.items}).then(function(res){
            $scope.data.checked = false;
            $scope.data.errors = [];
            $scope.data.parsed = false;
            $scope.data.headers = [];
            $scope.data.items = [];
            $scope.data.file = null;
            $scope.data.importSuccessfully = true;
        }, function(error){
            $scope.data.importError = true;
        })
    }

    $scope.cancelImport = function(){
        $scope.data.checked = false;
        $scope.data.errors = [];
        $scope.data.parsed = false;
        $scope.data.headers = [];
        $scope.data.items = [];
        $scope.data.importSuccessfully = false;
        $scope.data.importError = false;
    }

});
  