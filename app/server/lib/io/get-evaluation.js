! function () {

  'use strict';

  

  function getEvaluation (item_id) {
    var socket = this;

    require('syn/lib/domain')(

      function (error) {
        socket.app.arte.emit('error', error);
      },

      function (domain) {
        require('syn/models/Item')
          .evaluate(item_id, domain.intercept(function (evaluation) {
            socket.emit('got evaluation', evaluation);
          }));
      }

    );
  }

  module.exports = getEvaluation;

} ();
