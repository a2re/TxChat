'use strict';

angular.module('txChatApp')
  .controller('RoomCtrl', function ($scope, $rootScope, SocketProvider, $cookieStore) {
    if($cookieStore.get('chatters') == undefined) {
      $cookieStore.put('chatters', {});
    }
    $scope.chatters = $cookieStore.get('chatters');

    $scope.chatWith = function(username) {
      if($scope.chatters[username] === undefined) {
        var chatter = new Chatter(username);
        $scope.chatters[username] = chatter;
      }
      $cookieStore.put('chatters', $scope.chatters);
    };

    $scope.closeChat = function(username) {
      delete $scope.chatters[username];
      $cookieStore.put('chatters', $scope.chatters);
    };

    $scope.minimize = function(username) {
      $scope.chatters[username].minimize = ! $scope.chatters[username].minimize;
    }

    var socket = SocketProvider.io();
    socket.emit('login', $rootScope.globals.currentUser.login);

    socket.on('logged', function(usersOnline) {
      angular.forEach(usersOnline, function(value, key) {
        console.log(key);
        $rootScope.globals.users[key].isOnline = true;
      });
      $rootScope.$apply();
    });

    socket.on('disconnect', function(username) {
      try{
        $rootScope.globals.users[username].isOnline = false;
        $rootScope.$apply();
      } catch(e){}
    });

    socket.on('message', function(message) {
      if($scope.chatters[message.sender] === undefined && message.sender !== $rootScope.globals.currentUser.login) {
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
      $cookieStore.put('chatters', $scope.chatters);
    }

    var Chatter = function(username) {
      this.username = username;
      this.messages = [];
      this.minimize = false;
    }
  });
