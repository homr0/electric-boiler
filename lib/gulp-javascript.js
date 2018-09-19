// gulp-javascript
// Gulp task for bundling JavaScript modules

module.exports = function(gulp, $g, isProduction) {
  'use strict';

  // Configures the directories
  var config = require(__basedir + '/config.json');
  var dir = config.dir;
  var src = __basedir + dir.src;
  var dest = __basedir + dir.dest;
  var source = config.source;
  var output = config.output;

  // Error message function
  function onError(err) {
    console.log(err);
    this.emit('end');
  }
  
  return function(done) {
    gulp.src(src + source.js)
      .pipe($g.include({
        extensions: "js"
      }))
      .pipe($g.if(!isProduction, $g.sourcemaps.init()))
        .pipe($g.if(isProduction, $g.uglify({
          mangle: true,
          compress: {
            sequence: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true
          }
        }))).on('error', onError)
        .pipe($g.if(isProduction, $g.optimizeJs().on('error', onError)))
      .pipe($g.if(!isProduction, $g.sourcemaps.write('./')))
      .pipe(gulp.dest(dest + output.js));

      done();
  };
};
