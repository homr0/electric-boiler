// gulp-sass
// Gulp task for compiling Sass files

module.exports = function(gulp, $g, isProduction) {
  'use strict';

  // Configures the directories
  var config = require(__basedir + '/config.json');
  var dir = config.dir;
  var src = __basedir + dir.src;
  var dest = __basedir + dir.dest;
  var source = config.source;
  var output = config.output;

  // Compiles Sass into a CSS file
  var minifycss = $g.if(isProduction, $g.cssnano());

  return function(done) {
    gulp.src(src + source.scss)
      .pipe($g.sassBulkImport())  // Allows for compiling of SCSS directory
      .pipe($g.sass({
        outputStyle: 'nested',
        sourceComments: false,
        errLogToConsole: true
      }))
      .pipe($g.autoprefixer())
      .pipe(gulp.dest(dest + output.css));

      done();
  };
};
