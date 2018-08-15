// Build file.
// Required modules
var gulp = require('gulp');
var argv = require('yargs').argv;
var $g = require('load-plugins')('gulp-*', { strip: 'gulp' });
var metalsmith = require('metalsmith');
var $ms = require('load-plugins')('metalsmith-*', { strip: 'metalsmith' });

console.log($g);
console.log($ms);

// Check if there is a production flag via `gulp default --production`
var isProduction = !!(argv.production);
var pkg = require('./package.json');

// Directory variables
var dir = {
  base: __dirname + '/',
  lib: __dirname + '/lib/',
  src: 'src/',
  dest: 'public/'
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

// Custom plugins
var setdate = require(dir.lib + 'metalsmith-setdate');
var debug = require(dir.lib + 'metalsmith-debug');

// Image processing

// JavaScript module bundling

// Sass compiling

// Metalsmith static page generation
var ms = metalsmith(dir.base)
  .clean(isProduction)  // Cleans if production build
  .source(source.html)  // Source directory
  .destination(dir.dest)  // Destination directory
  .metadata(siteMeta) // Adds meta data to every page
  .use($ms.publish()) // Draft, private, or future dated check
  .use(setdate()) // Sets date on every page if not set in front
  .use($ms.collections({  // Determines page collection/taxonomy
    components: {
      pattern: 'components/**/*',
      metadata: {
        layout: 'default.hbs'
      }
    }
  }))
  .use($ms.markdown())  // Turns markdown into HTML
  .use($ms.permalinks({ // Generates permalinks
    pattern: ':title',
    relative: false,

    /*linksets: [{
      match: {collection: 'components'},
      pattern: ':collection/:title'
    }]*/
  }))
  .use($ms.registerHelpers({  // Gets Handlebars helpers
    directory: source.helpers
  }))
  .use($ms.discoverPartials({ // Gets Handlebars partials
    directory: source.partials
  }))
  .use($ms.inPlace({
    suppressNoFilesError: true
  })) // In-page layout templating (for Handlebars and Markdown)
  .use($ms.layouts({
    pattern: ['**/*/*.html', '**/*.md'],
    directory: source.layouts,
    default: 'default.hbs',
    engineOptions: {
      "cache": false
    }
  })) // Layout templating
  .use(debug(!isProduction))
  .build(function(err) {
    if(err) throw err;
  });
