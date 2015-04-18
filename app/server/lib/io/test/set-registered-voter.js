! function () {
  
  'use strict';

  module.exports = function (done) {
    
    var path        =   require('path');

    var should      =   require('should');

    var client      =  require('syn/io/test/socket').client;

    client.on('error', done);

    var Test        =   require('syn/lib/Test');

    var user;

    try {
      should.Assertion.set('user', require('syn/models/test/User/assert.user'), true);
    }
    catch ( error ) {
      // Assertion item already loaded
    }

    var is_registered = !! Math.round(Math.random());

    Test.suite('Socket "set registered voter"', {

      'add a listener': function (done) {
        client.on('set registered voter',require('syn/io/set-registered-voter').bind(client));

        done();
      },

      'should send "registered voter set"': function (done) {

        require('syn/lib/domain')(done, function (domain) {
          client.on('registered voter set', function (user_id) {

            user_id.should.be.an.Object;

            user.remove();

            done();
          });

          require('syn/models/User')
            .disposable(domain.intercept(function (_user) {

              user =  _user;

              user.should.be.a.user;

              client.emit('set registered voter', user._id, is_registered);

            }));
          });

      }

    }, done);

  };

} ();
