! function () {
  
  'use strict';

  require('should');

  var webDriver        =   require('syn/lib/webdriver');
  var Page        =   require('syn/lib/Page');
  var Domain = require('domain').Domain;
  var config = require('syn/config.json');

  var webdriver,
    url;

  describe( 'Web / Sign In' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function ( done ) {

      this.timeout(7500);

      var domain = new Domain().on('error', done);

      domain.run(function () {
        url = process.env.SYNAPP_SELENIUM_TARGET + Page('Home');

        webdriver = new webDriver({ url: url });

        webdriver.on('error', function (error) {
          throw error;
        });

        webdriver.on('ready', domain.intercept(done));
      });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a sign-in button' , function ( done ) {

      webdriver.client.isVisible('.login-button', done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    after ( function ( done ) {

      this.timeout(7500);

      webdriver.client.pause(5000);

      webdriver.client.end(done);
    
    } );

  });

} ();
