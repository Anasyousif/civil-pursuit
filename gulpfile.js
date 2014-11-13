var gulp          =   require('gulp');
var gutil         =   require('gulp-util');
var less          =   require('gulp-less');
var watchify      =   require('watchify');
var browserify    =   require('browserify');
var source        =   require('vinyl-source-stream');
var path          =   require('path');
var watch         =   require('gulp-watch');
var concat        =   require('gulp-concat');
var minifyCSS     =   require('gulp-minify-css');
var rename        =   require("gulp-rename");
var runSequence   =   require('run-sequence');
var uglify        =   require('gulp-uglifyjs');

var path_bower    =   'app/web/bower_components';
var path_less     =   'app/web/less';
var path_dist     =   'app/web/dist';
var path_angular  =   'app/web/angular';
var path_ngapp    =   path.join(path_angular, 'synapp')

/*
 *  COMPILE LESS
 *  ============
*/

gulp.task('less', function gulpCompileLess (cb) {
  gulp.src(path.join(path_less, 'synapp.less'))
    .pipe(less({
      paths: [
        path.join(__dirname, path_bower, 'boostrap/less')
      ]
    }))
    .pipe(gulp.dest(path.join(path_dist, 'css')))
    .on('end', cb);
});

/*
 *  MINIFY CSS
 *  ==========
*/

gulp.task('min-css', function gulpMinifyCSS () {
  gulp.src(path.join(path_dist, 'css/synapp.css'))
    .pipe(minifyCSS())
    .pipe(rename(function (path) {
      path.extname = '.min.css';
    }))
    .pipe(gulp.dest(path.join(path_dist, 'css')));
});

/*
 *  MINIFY C3 CSS
 *  =============
*/

gulp.task('min-css-c3', function gulpMinifyC3CSS () {
  gulp.src(path.join(path_bower, 'c3/c3.css'))
    .pipe(minifyCSS())
    .pipe(rename(function (path) {
      path.extname = '.min.css';
    }))
    .pipe(gulp.dest(path.join(path_dist, 'css')));
});

/*
 *  CONCAT BOOTSTRAP
 *  ================
*/

gulp.task('concat-bs', function concatBsJS () {

  gulp.src(path.join(path_bower,
    'bootstrap/**/{tooltip,transition,collapse,modal,dropdown}.js'))

    .pipe(concat('bootstrap.js'))

    .pipe(gulp.dest(path.join(path_dist, 'js')));
});

/*
 *  UGLIFY BOOTSTRAP
 *  ================
*/

gulp.task('ugly-bs', function uglifyBs () {

  gulp.src(path.join(path_dist, 'js/bootstrap.js'))

    .pipe(uglify())

    .pipe(rename(function (path) {
      path.extname = '.min.js';
    }))

    .pipe(gulp.dest(path.join(path_dist, 'js')));
});

/*
 *  BROWSERIFY APP
 *  ==============
*/

gulp.task('browserifyApp', function browserifyApp () {
  return browserify(path.join(__dirname, path_ngapp, 'index.js'))
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('bundle.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest(path.join(path_dist, 'js')));
});

/*
 *  UGLIFY APP
 *  ==========
*/

gulp.task('ugly-app', function uglifyApp () {

  gulp.src(path.join(path_dist, 'js/bundle.js'))

    .pipe(uglify())

    .pipe(rename(function (path) {
      path.extname = '.min.js';
    }))

    .pipe(gulp.dest(path.join(path_dist, 'js')));
});

////////////////////////////////////////////////////////////////////////////////
//    WATCHERS
////////////////////////////////////////////////////////////////////////////////

/*
 *  WATCHIFY APP
 *  ============
*/

gulp.task('watchifyApp', function watchifyApp () {
  var bundler = watchify(browserify(path.join(__dirname, path_ngapp, 'index.js'),
    watchify.args));

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(path.join(path_dist, 'js')));
  }

  return rebundle();
});

/*
 *  WATCH LESS
 *  ==========
*/

gulp.task('watch-less', function watchLess () {
  gulp.watch('app/web/less/*.less', ['less']);
});

/*
 *  ALL WATCHERs
 *  ============
*/

gulp.task('watch', ['watch-less', 'watchifyApp'], function watch () {

});

////////////////////////////////////////////////////////////////////////////////
//    BUILDERS
////////////////////////////////////////////////////////////////////////////////

/*
 *  BUILD
 *  =====
*/

gulp.task('build', ['less', 'concat-bs', 'browserifyApp'], function (cb) {
  cb();
});

/*
 *  BUILD PROD
 *  ==========
*/

gulp.task('build-prod', ['build'], function (cb) {
  runSequence('min-css', 'min-css-c3', 'ugly-bs', 'ugly-app', cb);
});


///////////////////////////////////////////////////////////

// gulp.task('default', function() {
//   // place code for your default task here
// });





// var uglify      = require('gulp-uglifyjs');



// // js docs

// var shell = require('gulp-shell');

// gulp.task('docs', shell.task([ 
//   'node_modules/jsdoc/jsdoc.js '+ 
//     '-c node_modules/angular-jsdoc/conf.json '+   // config file
//     '-t node_modules/angular-jsdoc/template '+    // template file
//     '-d build/docs '+                             // output directory
//     '-r '+                                        // recursive
//     'public/js/angular/synapp models'             // source code directory
// ]));
