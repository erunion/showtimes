var jshint = require('gulp-jshint');
var gulp = require('gulp');

gulp.task('lint', function() {
  return gulp.src(['index.js', 'test/**.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
