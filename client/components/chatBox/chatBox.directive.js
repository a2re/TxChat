'use strict';

angular.module('txChatApp')
  .directive('chatBox', function() {
    return {
      restrict: 'E',
      templateUrl: 'components/chatBox/chatBox.html'
    };
  });
