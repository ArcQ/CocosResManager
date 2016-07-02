var gulp = require('gulp');
var mocha = require('gulp-mocha');
var util = require('gulp-util');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');

gulp.task('build', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/'+'ResManager.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('ResManager.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(gulpif(argv.prod, buffer()))
        .pipe(gulpif(argv.prod, uglify()))
        .on('error', util.log)
    .pipe(sourcemaps.write('./src/maps/'))
    .pipe(gulp.dest('./'));
});

gulp.task('test', function () {
    return gulp.src(['test/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', util.log);
});
 
gulp.task('watch-test', function () {
    gulp.watch(['src/**', 'test/**'], ['build','test']);
});

