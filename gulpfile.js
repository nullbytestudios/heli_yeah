;(function () {
  'use strict';
  var gulp = require('gulp');
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');
  var merge = require('merge-stream');

  gulp.task('build', function () {
    var assets = gulp.src('./assets/**/**/*')
      .pipe(gulp.dest('./dist/assets/'));

    var engine = gulp.src('./node_modules/phaser/dist/phaser.min.js')
      .pipe(gulp.dest('./dist/'));

    var game = browserify('./src/game.js')
      .bundle()
      .pipe(source('game.js'))
      .pipe(gulp.dest('./dist/'));

    var window = gulp.src('./src/index.html')
      .pipe(gulp.dest('./dist/'));
      
    var levels = gulp.src('./src/levels/*')
      .pipe(gulp.dest('./dist/levels/'));

    return merge(assets, engine, game, window, levels);
  });
  
  gulp.task('default', ['build']);
})();