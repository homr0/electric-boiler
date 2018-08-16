// metalsmith-build
// task for generating HTML pages using Metalsmith

// Required Metalsmith build modules
var metalsmith = require('metalsmith');
var $ms = require('load-plugins')('metalsmith-*', { strip: 'metalsmith' });
console.log($ms);

module.exports = function(siteMeta, dir, source, isProduction, debugLog) {
  'use strict';

  // Custom plugins
  var setdate = require(dir.lib + 'metalsmith-setdate');
  var debug = debugLog ? require(dir.lib + 'metalsmith-debug') : null;

  return function(done) {
    console.log("Metalsmithing!");
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
      .use($ms.layouts({ // Layout templating
        pattern: ['**/*.html', '**/*.md'],
        directory: source.layouts,
        default: 'default.hbs',
        engineOptions: {
          cache: false
        }
      }));

    // Optional debug
    if(debug) ms.use(debug());

    // Build the HTML pages
    ms.build(function(err) {
      if(err) throw err;
    });
    
    done();
  };
};
