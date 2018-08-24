// gulpfile
// runs all Gulp tasks

// Required Gulp modules
var gulp = require('gulp');
var $g = require('load-plugins')('gulp-*', { strip: 'gulp' });
var argv = require('yargs').argv;
var browser = require('browser-sync');
var del = require('del');

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
gulp.task('images', require(lib + '/gulp-images')(gulp, $g, isProduction));

gulp.task('icons', require(lib + '/gulp-icons')(gulp, $g, isProduction));

// JavaScript module bundling
gulp.task('javascript', require(lib + '/gulp-javascript')(gulp, $g, isProduction));

// Sass compiling
gulp.task('sass', require(lib + '/gulp-sass')(gulp, $g, isProduction));

// Metalsmith static page generation
gulp.task('metalsmith', require(lib + '/metalsmith-build')(siteMeta, isProduction, debugLog));

// Task to build HTML files
gulp.task('html', gulp.series('metalsmith'));

// Task to clean production folder
gulp.task('clean', function(done) {
  del.sync(dest);
  done();
});

gulp.task('browser-sync', function() {
  browser.init({

  })
});
// Gulp sequences
// Build sequence
gulp.task('build', gulp.series('clean', 'javascript', gulp.parallel('images', 'icons'), 'sass', 'html'));

// Watch sequence
gulp.task('watch', function(done) {
  browser.init({
        server: dest,
        notify: false,
        injectChanges: true,
        reloadDelay: 300,
        port: 9000
    });

    // Local change to the source directory path
    src = src.replace(__basedir + '/', "");

    // Watches for any changes in JavaScript files
    gulp.watch(src + 'assets/js/**/*.js', gulp.series('javascript', browser.reload));

    // Watches for any changes in the Sass files
    gulp.watch(src + 'assets/scss/**/*.scss', gulp.series('sass', browser.reload));

    // Watches for any changes in the images directory
    gulp.watch(src + source.images, gulp.series('images', browser.reload));

    // Watches for any changes in the icons directory
    gulp.watch(src + source.icons, gulp.series('icons', browser.reload));

    // Watches for any changes in the content pages, layouts or partials
    gulp.watch([src + source.html + '**/*.{md,html}', src + source.layouts + '**/*.hbs', src + source.partials + '**/*.hbs'], gulp.series('html', browser.reload));

    done();
});

// Default sequence
gulp.task('default', gulp.series('build', 'watch'));
