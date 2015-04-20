! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function makePasswordResettable (email, cb) {

    var self = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

      var key = require('crypto').randomBytes(5).toString('hex');
      var token = require('crypto').randomBytes(5).toString('hex');

      self
        
        .update(

          { email: email },
          
          {
            activation_key: key, 
            activation_token: token
          }
        
        )

        .exec(domain.intercept(function (number) {
          if ( ! number ) {
            var error = new Error('No such email');

            error.code = 'DOCUMENT_NOT_FOUND';

            throw error;
          }

          cb(null, { key: key, token: token });
        }));
    });
  }

  module.exports = makePasswordResettable;

} ();
