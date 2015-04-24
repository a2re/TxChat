'use strict';

angular.module('txChatApp')
  .factory('Authentication', function($http, md5, $cookieStore, $rootScope, $q) {
    var service = {};
    service.users = false;

    service.getUsers = function() {
      var deferred = $q.defer();
      if(! service.users) {
        $http.get('users.json')
          .success(function (data, status) {
            service.users = data;
            deferred.resolve(service.users);
          }).error(function (data, status) {
            deferred.reject('Serveur injoignable !!!');
          });
      } else {
        deferred.resolve(service.users);
      }
      return deferred.promise;
    }

    service.login = function(user) {
      var deferred = $q.defer();
      var isLogged = false;
      var users = service.getUsers().then(function(users) {
        angular.forEach(users, function(value) {
          if(value.login === user.login && value.password === md5.createHash(user.password)) {
            isLogged = true;
          }
        });
        deferred.resolve(isLogged);
      }, function(msg) {
        deferred.reject(msg)
      });
      return deferred.promise;
    };

    service.setCredentials = function (user) {
      var authdata = md5.createHash(user.login + ':' + user.password);

      $rootScope.globals = {
        currentUser: {
          login: user.login,
          authdata: authdata
        },
        users : service.users
      };
      $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
      $cookieStore.put('globals', $rootScope.globals);
    };

    service.ClearCredentials = function () {
      $rootScope.globals = {};
      $cookieStore.remove('globals');
      $http.defaults.headers.common.Authorization = 'Basic ';
    };

    return service;
  })

  // Socket provider
  .factory('SocketProvider', function($rootScope) {
    var factory = {};
    factory.socket = false;

    factory.io = function() {
      factory.socket = factory.socket ? factory.socket : io();
      return factory.socket;
    }
    return factory;
  })
