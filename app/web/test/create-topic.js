! function () {
  
  'use strict';

  var _ = {};

  _['panels']                 =       '.panels';
  _['topics panel']           =       '#panel-Topic';
  _['toggle']                 =       '.toggle-creator';
  _['creator']                =       'form.creator[name="create"][novalidate][role="form"][method="POST"]';
  _['submit']                 =       _['creator'] + ' .button-create';
  _['subject']                =       _['creator'] + ' input[name="subject"][required]';
  _['description']            =       _['creator'] + ' textarea[name="description"][required]';

  function __ (n) {
    return _[n];
  }

  if ( ! process.env.SYNAPP_SELENIUM_TARGET ) {
    throw new Error('Missing SYNAPP_SELENIUM_TARGET');
  }

  var User = require('../../business/models/User');

  require('mongoose').connect(process.env.MONGOHQ_URL);

  var testUser;

  module.exports = {
    "before": function (browser, done) { 
      User.disposable(function (error, user) {
        testUser = user;
        
        done();
      });
    },

    "Create topic" : function (browser) {
      
      browser.url(process.env.SYNAPP_SELENIUM_TARGET);

      browser.setCookie({
        name     : "synuser",
        value    : JSON.stringify({ email: testUser.email, id: testUser._id }),
        secure   : false,
      }, function (res) {
        if ( res.state !== 'success' ) {
          throw new Error('Could not set cookie');
        }
      });

      browser.refresh();
        
      browser.waitForElementVisible(            'body', 1000)

        .assert.visible(__(                     'panels'), "There should be a panels container")
        .waitForElementVisible(__(              'topics panel'), 2000, "There should be a top-level panel containing the topics")
        .assert.visible(__(                     'toggle'), "There should be a toggler for panel")
        .click(__(                              'toggle'))
        .waitForElementVisible(__(              'creator'), 1000, "The creator panel should appear")
        .click(__(                              'submit'))
        .assert.cssClassPresent(__(             'subject'), 'error', 'After trying to create an empty topic, subject should show error')
        .setValue(__(                           'subject'), 'This is a test topic generated by Selenium')
        .click(__(                              'submit'))
        .assert.cssClassPresent(__(             'description'), 'error', 'After trying to create an empty topic, description should show error')
        .setValue(__(                           'description'), 'This is a test topic generated by Selenium. This item has no reference and no image.')
        .click(__(                              'submit'))

        .pause(2500)
        
        .end();
    },

    "after": function (browser, done) {
      testUser.remove(done);
      require('mongoose').disconnect();
    }
  };

} ();

