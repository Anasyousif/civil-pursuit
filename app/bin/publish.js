#!/usr/bin/env node

! function () {
  
  'use strict';

  console.time('publish');

  require('colors');

  var cp = require('child_process');

  var test = 'app/bin/test.js';

  var deployMessage = process.argv[2];

  var tests = [
    // { name: 'app/bin/build.js css' },
    // { name: 'app/bin/build.js browserify-pages' },
    // { name: 'app/bin/build.js uglify-pages' },

    { name: 'git commit -am "' + deployMessage.replace(/\s/g, '%%%%%') +'"', ok: [0, 1, 8792, 7182] },

    // { name: 'mocha test/lib/util/arguments-to-array' },
    // { name: 'mocha test/lib/util/cloudinary' },
    // { name: 'mocha test/lib/util/di' },
    // { name: 'mocha test/lib/util/encrypt' },
    // { name: 'mocha test/lib/util/get-url-title' },
    // { name: 'mocha test/lib/util/is/cloudinary-url' },
    
    // { name: 'mocha test/models/Item/Item test/models/Item/methods test/models/Item/statics test/models/Item/pre' },
    
    // { name: 'mocha test/models/User/statics/disposable'},

    // { name: 'node app/bin/test test/web/pages/not-found' },
    // { name: 'node app/bin/test test/web/pages/error' },
    // { name: 'node app/bin/test test/web/pages/synchronous-error' },
    // { name: 'node app/bin/test test/web/pages/asynchronous-error' },
    // { name: 'node app/bin/test test/web/pages/terms-of-service' },
    { name: 'node app/bin/test test/web/pages/home' },
    // { name: 'node app/bin/test test/web/pages/item-not-found' },
    // { name: 'node app/bin/test test/web/pages/item-page' },
    // { name: 'node app/bin/test test/web/pages/profile' },

    { name: 'git push heroku master' }
  ];

  require('async').eachSeries(tests,
    function (test, cb) {
      var action = test;

      console.log("\n", ('⌛ ' + action.name.replace(/%%%%%/g, ' ')).bgBlue.bold, "\n");

      var chunks = test.name.split(/\s/).map(function (chunk) {
        return chunk.replace(/%%%%%/g, ' ');
      });

      var cmd = chunks.shift();

      cp

        .spawn(cmd, chunks, { stdio: 'inherit' })

        .on('exit', function (status) {

          var ok = test.ok || [0];

          if ( ok.indexOf(status) > -1 ) {

            console.log("\n", ('✔ ' + action.name).bgGreen.bold, "\n");

            cb();

          }

          else {
            console.log('exit: ' + status);
            throw new Error(action.name);
          }

        });
    },

    function (error) {
      console.log(arguments);
      console.timeEnd('publish');
    });

} ();
