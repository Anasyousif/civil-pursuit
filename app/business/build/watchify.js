! function () {

  'use strict';

  var gulp          =   require('gulp');
  var path          =   require('path');
  var browserify    =   require('browserify');
  var watchify      =   require('watchify');
  var source        =   require('vinyl-source-stream');
  var gutil         =   require('gulp-util');
  var config        =   require('../config.json');

  module.exports = function watchifyApp () {
    var bundler = watchify(browserify(path.join(process.cwd(), config.files['app js']),
      watchify.args));

    bundler.on('update', rebundle);

    function rebundle() {
      return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('index.js'))
        .pipe(gulp.dest(config.dirs['dist js']));
    }

    return rebundle();
  };

}();
