// gulp-icons
// Gulp task for setting up icons

module.exports = function(gulp, $g, isProduction) {
  'use strict';

  // Configures the directories
  var config = require(__basedir + '/config.json');
  var dir = config.dir;
  var src = __basedir + dir.src;
  var dest = __basedir + dir.dest;
  var source = config.source;
  var output = config.output;

  // Optimizes icons in production mode
  var imagemin = $g.if(isProduction, $g.imagemin([
    $g.imagemin.svgo({
      plugins: [
        { removeViewBox: true }
      ]
    })
  ], {
    verbose: true
  }));

  return function(done) {
    gulp.src(src + source.icons)
      .pipe($g.newer(dest + output.icons)) // Checks if image has been updated
      .pipe(imagemin) // Minimizes images in production mode
      .pipe(gulp.dest(dest + output.icons));

      done();
  };
};
