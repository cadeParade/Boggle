var gulp = require('gulp');
var sass = require('gulp-sass');
var bourbon = require('node-bourbon');
var react = require('gulp-react');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');
var reactify = require('reactify');
var notify = require("gulp-notify");


// gulp.task('app', function() {
  // var bundler = watchify(browserify('./static/jsx/main.jsx', watchify.args));
  // bundler.transform('reactify');
  // bundler.on('update', rebundle);

  // function rebundle() {
  //   return bundler.bundle({ debug: true })
  //     .on('error', gutil.log.bind(gutil, 'Browserify Error'))
  //     .on('error', notify.onError(function (error) {
  //       return error.message;
  //     }))
  //     .pipe(source('bundle.js'))
  //     .pipe(gulp.dest('./static/js/dist/'));
  // }

  // return rebundle();
// });


gulp.task('sass', function () {
  gulp.src('./static/scss/*')
    .pipe(sass({
      // includePaths: require('node-bourbon').with('other/path', 'another/path')
      // - or -
      includePaths: bourbon.includePaths,
    }))
    .pipe(gulp.dest('./static/css/bourbon.css'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./static/scss/*', ['sass']);
});

// Default Task
gulp.task('default', ['watch']);
