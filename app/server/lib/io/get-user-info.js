! function () {

  'use strict';

  var User = require('../../../business/models/User');

  /**
   *  @arg {String} item - Item ObjectID String (_id)
   *  @arg {Function} cb
   */

  function getUserInfo (user_id) {
    var socket = this;

    socket.domain.run(function () {

      User
        .findById(user_id)
        .lean()
        .exec(socket.domain.intercept(function (user) {
          delete user.password;
          socket.emit('got user info', user);
        }));
    });
  }

  /**
   *  Export as a socket event listener
   */

  module.exports = function (socket) {
    socket.on('get user info', getUserInfo.bind(socket));
  };

} ();
