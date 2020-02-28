'use strict';


angular.module('bobbyApp')
  .controller('logsCtrl', function ($scope, serviceAjax, $location, $rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if(!$rootScope.isAdmin()){
      $location.path('/error/403');
    }

    $scope.error = false;

    $scope.dates = {
      currentDate : new Date(),
      selectedDate : new Date(),
    }

    // Chargement des bugs
    var loadLogs = function(selectedDate){
        $scope.loading = true;
        const day = ("0" + (selectedDate.getDate())).slice(-2);
        const month_number = ("0" + (selectedDate.getMonth() + 1)).slice(-2)
        const year = selectedDate.getFullYear();
        const date = year + "-" + month_number + "-" + day;
        serviceAjax.post('logs', {date : date}).then(function(res){
            $scope.logs = res.data;
            $scope.loading = false;
        })
    }
    loadLogs($scope.dates.selectedDate);


     /* Listener sur la date sélectionnée */
     $scope.$watch("dates.selectedDate", function(){
       if ($scope.dates.selectedDate) {
        loadLogs($scope.dates.selectedDate);
       }
    });

    $scope.logLevel = "error";

    $scope.isActive = function(logLevel){
      return logLevel == $scope.logLevel;
    }

    $scope.changeLogLevel = function(logLevel){
      $scope.logLevel = logLevel;
    }

    $scope.showLog = function(log){
      if ($scope.logLevel == "all") {
        return true;
      }
      return log.level == $scope.logLevel;
    }

  });

