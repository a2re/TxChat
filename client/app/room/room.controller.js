'use strict';

angular.module('txChatApp')
  .controller('RoomCtrl', function ($scope, $rootScope, SocketProvider, $cookieStore, Authentication) {

    if($rootScope.globals.currentUser) {
      $rootScope.currentUser = $rootScope.globals.currentUser.login;
    }

    $scope.chatters = {};
    Authentication.getUsers().then(function(users) {
      $rootScope.users = users;
    }, function(error) {
      $scope.error = error;
    });
    console.log($rootScope.currentUser);
    console.log($rootScope.users);

    $scope.chatWith = function(username) {
      if($scope.chatters[username] === undefined) {
        var chatter = new Chatter(username);
        $scope.chatters[username] = chatter;
      }
    };

    $scope.closeChat = function(username) {
      delete $scope.chatters[username];
    };

    $scope.minimize = function(username) {
      $scope.chatters[username].minimize = ! $scope.chatters[username].minimize;
    }

    var socket = SocketProvider.io();
    socket.emit('login', $rootScope.currentUser);

    socket.on('logged', function(usersOnline) {
      angular.forEach(usersOnline, function(value, key) {
        $rootScope.users[key].isOnline = true;
      });
      $rootScope.$apply();
    });

    socket.on('disconnect', function(username) {
      try{
        $rootScope.users[username].isOnline = false;
        $rootScope.$apply();
      } catch(e){}
    });

    socket.on('message', function(message) {
      if($scope.chatters[message.sender] === undefined && message.sender !== $rootScope.currentUser) {
        var chatter = new Chatter(message.sender);
        $scope.chatters[message.sender] = chatter;
      }
      if($scope.chatters[message.chatter] !== undefined) {
        $scope.chatters[message.chatter].messages.push(message);
      }
      if($scope.chatters[message.sender] !== undefined) {
        $scope.chatters[message.sender].messages.push(message);
      }
      $scope.$apply();
    });

    $scope.send = function(message, chatter) {
      message.chatter = chatter;
      message.date = new Date();
      socket.emit('message', message);
      message.content = '';
    }

    var Chatter = function(username) {
      this.username = username;
      this.messages = [];
      this.minimize = false;
    }
  });
