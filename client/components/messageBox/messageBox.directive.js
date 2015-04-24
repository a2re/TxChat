'use strict';

angular.module('txChatApp')
  .directive('messageBox', function() {
    return {
      restrict: 'E',
      templateUrl: 'components/messageBox/messageBox.html',
      scope: {
        'chatter': '=',
        'message': '=',
        'login': '='
      }
    };
  });
