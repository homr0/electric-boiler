#!/usr/bin/env node
// Build commands
//  `node ./server.js` or `npm start`: runs the development build
//  `--production` or `npm run production`: this flag makes the production build
//  `--debug` or `npm run debug`: this flag opens up the debug log

// Required modules
var argv = require('yargs').argv;
var browser = require('browser-sync');
var del = require('del');

// Checks for flags and the version number
var isProduction = !!(argv.production);
var debugLog = !!(argv.debug);
var pkg = require('./package.json');

// Directory variables
var dir = {
  base: __dirname + '/',
  lib: __dirname + '/lib/',
  src: __dirname + '/src/',
  dest: __dirname + '/public/'
}

var source = {
  icons: dir.src + 'assets/img/**/*.svg',
  js: dir.src + 'assets/js/core.js',
  scss: dir.src + 'assets/scss/main.scss',
  data: dir.src + 'data/',
  helpers: dir.src + 'helpers/',
  html: dir.src + 'html/',
  images: dir.src + 'images/**/*.{svg,png,jpeg,jpg,gif}',
  layouts: dir.src + 'layouts/',
  partials: dir.src + 'partials/'
}

var output = {
  css: dir.dest + 'assets/css/',
  icon: dir.dest + 'assets/img/',
  js: dir.dest + 'assets/js/',
  images: dir.dest + 'images/'
}

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

// Gets the Metalsmith build
var metalsmithBuild = require(dir.lib + 'metalsmith-build')(siteMeta, dir, source, isProduction, debugLog);

// Gets the Gulp build
//var gulpBuild = require(dir.lib + 'gulpfile.js')(isProduction, dir, source, metalsmithBuild);
