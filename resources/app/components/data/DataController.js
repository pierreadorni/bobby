app.controller('dataCtrl', function($scope, $rootScope, $location, Data, serviceAjax, FileSaver, $http) {

    
    // On vérifie que l'utilisateur est admin dans au moins une asso
    
    if (!$rootScope.canBook()) {
        $location.path('/error/403')
    }


    // Chargement realtifs aux associations de l'utilisateur

    $scope.assos = [];
    $scope.asso_id = null;

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
            $scope.asso_id = $scope.assos[0].id
          //Pour empêcher le select des assos de s'afficher
          $scope.singleAssociation = true;
        }
        $scope.loading=false;
    }
    loadAssociations();


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
  