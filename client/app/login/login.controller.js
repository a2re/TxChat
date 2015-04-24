'use strict';

angular.module('txChatApp')
  .controller('LoginCtrl', function ($scope, $location, $rootScope, Authentication) {

    if($rootScope.globals.currentUser !== undefined) {
      $location.path('/room');
    }

    $scope.connect = function(user) {
      /* Authentification de l'utilisateur */
      Authentication.login(user).then(function(isLogged) {
        if(isLogged) {
          Authentication.setCredentials(user);
          $location.path('/room');
        }
      }, function(msg){
        $scope.error = msg;
      });
    }
  });
