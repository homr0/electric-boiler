// gulp-imagemin
// Gulp task for minimizing PNG, JPEG, GIF and SVG images

module.exports = function(gulp, $g, isProduction) {
  'use strict';

  // Configures the directories
  var config = require(__basedir + '/config.json');
  var dir = config.dir;
  var src = __basedir + dir.src;
  var dest = __basedir + dir.dest;
  var source = config.source;
  var output = config.output;

  // Optimizes images in production mode
  var imagemin = $g.if(isProduction, $g.imagemin([
    $g.imagemin.gifsicle({
      interlaced: true
    }),
    $g.imagemin.jpegtran({
      progressive: true
    }),
    $g.imagemin.optipng({
      optimizationLevel: 5
    }),
    $g.imagemin.svgo({
      plugins: [
        { removeViewBox: true }
      ]
    })
  ], {
    verbose: true
  }));

  return function() {
    return gulp.src(src + source.images)
      .pipe($g.newer(dest + output.images)) // Checks if image has been updated
      .pipe(imagemin) // Minimizes images in production mode
      .pipe(gulp.dest(dest + output.images));
  };
};
