'use strict';

angular.module('txChatApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, Authentication, SocketProvider) {
    $scope.menu = [
      {
        'title': 'Accueil',
        'link': '/'
      },
      {
        'title': 'Room',
        'link': '/room'
      }
    ];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.disconnect = function() {
      var socket = SocketProvider.io();
      socket.emit('disconnection');
      Authentication.ClearCredentials();
    }
  });
