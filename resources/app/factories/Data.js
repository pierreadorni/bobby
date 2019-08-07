/**
 *  Gère l'authentification auprès de l'API
 */
app.factory('Data', function(localStorageService){
  
    factory = {}


    // User Associations
    factory.setUserAssos = function(userassos){
        localStorageService.set('userassos', userassos);
    }

    factory.loadUserAssos = function(){
        return localStorageService.get('userassos');
    }


    // Associations
    factory.setAssociations = function(associations){
        localStorageService.set('associations', associations);
    }

    factory.loadAssociations = function(){
        return localStorageService.get('associations');
    }


    // Item Places
    factory.setItemPlaces = function(itemplaces){
        localStorageService.set('itemplaces', itemplaces);
    }

    factory.loadItemPlaces = function(){
        return localStorageService.get('itemplaces');
    }


    // Itemp Types
    factory.setItemTypes = function(itemtypes){
        localStorageService.set('itemtypes', itemtypes);
    }

    factory.loadItemTypes = function(){
        return localStorageService.get('itemtypes');
    }
    
    return factory;

  });
  