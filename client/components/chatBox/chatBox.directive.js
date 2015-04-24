'use strict';

angular.module('txChatApp')
  .directive('chatBox', function() {
    return {
      restrict: 'E',
      templateUrl: 'components/chatBox/chatBox.html'/*,
      scope: {
        chatter: '=',
        'close': '&',
        'send': '&'
      }*//*,
      link: function(scope, element, atttrs) {
        scope.send(message) {

        }
      }*/
    };
  });
