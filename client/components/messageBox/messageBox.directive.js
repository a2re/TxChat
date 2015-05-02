'use strict';

angular.module('txChatApp')
  .directive('messageBox', function($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'components/messageBox/messageBox.html',
      scope: {
        'chatter': '=',
        'message': '=',
        'login': '='
      },
      link: function(scope, element, atttrs) {
        var box = element.parents(".panel-body:first");
        $timeout(function () {
          angular.element(box)[0].scrollTop = 100000000000;
        });
      }
    };
  });
