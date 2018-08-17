// metalsmith-build
//  Metalsmith build file for generating HTML files

module.exports = function(siteMeta, isProduction, debugLog) {
  'use strict';

  return function(done) {
    // Required Metalsmith build modules
    var metalsmith = require('metalsmith');
    var $ms = require('load-plugins')('metalsmith-*', { strip: 'metalsmith' });

    // Configures the directories
    var config = require(__basedir + '/config.json');
    var dir = config.dir;
    var src = __basedir + dir.src;
    var source = config.source;

    // Custom plugins
    var setdate = require(__basedir + dir.lib + 'metalsmith-setdate');
    var debug = debugLog ? require(__basedir + dir.lib + 'metalsmith-debug') : null;

    // Metalsmith build process
    var ms = metalsmith(__basedir + dir.base)
      .clean(isProduction)  // Cleans if production build
      .source(src + source.html)  // Source directory
      .destination(__basedir + dir.dest)  // Destination directory
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
        directory: src + source.helpers
      }))
      .use($ms.discoverPartials({ // Gets Handlebars partials
        directory: src + source.partials
      }))
      .use($ms.inPlace({
        suppressNoFilesError: true
      })) // In-page layout templating (for Handlebars and Markdown)
      .use($ms.layouts({ // Layout templating
        pattern: ['**/*.html', '**/*.md'],
        directory: src + source.layouts,
        default: 'default.hbs',
        engineOptions: {
          cache: false
        }
      }));

    // Minifies HTML when in production mode
    if(isProduction) ms.use($ms.htmlMinifier());

    // Optional debug
    if(debug) ms.use(debug());

    // Build the HTML pages
    ms.build(function(err) {
      if(err) throw err;
    });

    done();
  };
};
