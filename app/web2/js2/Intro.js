/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  INTRO

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function Intro () {

  'use strict';

  function Intro () {

  }

  Intro.prototype.render = function () {
    app.socket.emit('get intro');

    app.socket.on('got intro', function (intro) {
      $('#intro').find('.panel-title').text(intro.subject);
    });
  };

  module.exports = Intro;

} ();
