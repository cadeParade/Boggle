var gulp = require('gulp');
var sass = require('gulp-sass');
var bourbon = require('node-bourbon');
var nodemon = require('gulp-nodemon');


gulp.task('sass', function () {
  gulp.src('./static/scss/*')
    .pipe(sass({
      // includePaths: require('node-bourbon').with('other/path', 'another/path')
      // - or -
      includePaths: bourbon.includePaths,
    }))
    .pipe(gulp.dest('./static/css/bourbon.css'));
});

//this is terrible
// gulp.task('develop', function () {
//   nodemon({ script: 'app.js', ext: 'html js'})
//   .pipe(livereload({ auto: false }))
//     .on('restart', function () {
//       console.log('restarted!')
//     })
// })

// Watch Files For Changes
gulp.task('watch', function() {
    // gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('./static/scss/*', ['sass']);
    gulp.watch('./*.js', ['develop']);
});

// Default Task
gulp.task('default', ['sass', 'watch']);
// gulp.task('default', ['sass', 'develop', 'watch']);