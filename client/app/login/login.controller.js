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
          if (user.remember) {
            Authentication.setCredentials(user);
          }
          $rootScope.currentUser = user.login;
          $location.path('/room');
        }
      }, function(msg){
        $scope.error = msg;
      });
    };
  });
