'use strict';

angular.module('txChatApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl',
        data: {
          requireLogin: false
        }
      });
  });
