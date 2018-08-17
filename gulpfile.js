// gulpfile
// runs all Gulp tasks

// Required Gulp modules
var gulp = require('gulp');
var $g = require('load-plugins')('gulp-*', { strip: 'gulp' });
var argv = require('yargs').argv;
var browser = require('browser-sync');
var del = require('del');

console.log($g);

// Checks for flags and the version number
var isProduction = !!(argv.production);
var debugLog = !!(argv.debug);
var pkg = require('./package.json');

// Configuration variables
global.__basedir = __dirname;
var config = require('./config.json');
var dir = config.dir;
var src = __basedir + dir.src;
var source = config.source;
var dest = __basedir + dir.dest;
var output = config.output;
var lib = __basedir + dir.lib;

// Site metadata
var siteMeta = {
  version: pkg.version,
  name: "Electric Boiler",
  desc: "A demonstration static site built using Metalsmith and Gulp",
  author: "Rebecca Hom",
  domain: isProduction ? 'https://rawgit.com' : 'http://127.0.0.1',
  rootpath: isProduction ? '/homr0/electric-boiler/master' + dir.dest : './'
}

console.log((isProduction ? 'Production' : 'Development'), 'build, version', pkg.version);

// Development tasks
// Image processing
gulp.task('images', require(lib + '/gulp-images')(gulp, $g));
/*gulp.task('images', function() {
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
  }))
});*/

// JavaScript module bundling

// Sass compiling

// Metalsmith static page generation
gulp.task('metalsmith', require(lib + '/metalsmith-build')(siteMeta, isProduction, debugLog));