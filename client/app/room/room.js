'use strict';

angular.module('txChatApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('room', {
        url: '/room',
        templateUrl: 'app/room/room.html',
        controller: 'RoomCtrl',
        data : {
          requireLogin: true
        }
      });
  });
