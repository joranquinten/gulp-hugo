module.exports = function(
  gulp, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles, autoprefixer, cssgrace, pseudoelements
) {
  return function() {
    var autoprefixer = require('autoprefixer');
    var cssgrace = require('cssgrace');
    var pseudoelements = require('postcss-pseudoelements');

    var path = confFileMap.env.dev;
    if (!confGlobal.isDevelop) path = confFileMap.env.prod;
    var base = path.base,
      ref = confFileMap.sourceFiles.scss;

    if (confGlobal.cleanBeforeRun) {
      console.log('deleting: ' + path.dest + confFileMap.targetFolders.css + '**/*.css');
      del(path.dest + confFileMap.targetFolders.css + '**/*.css');
    }

    // Define PostCSS plugins
    var processors = [
      autoprefixer(confPlugins.autoprefixer),
      cssgrace,
      pseudoelements
    ];

    return gulp.src(pathFiles(base, ref))
      .pipe(plugins.plumber({
        handleError: function(err) {
          console.log(err);
          this.emit('end');
        }
      }))
      .pipe(plugins.scssLint(confPlugins.scssLint))
      .pipe(plugins.sass())
      .pipe(plugins.concat(confFileMap.targetFiles.css))
      //.pipe(plugins.uncss({ html: pathFiles(base, confFileMap.sourceFiles.html) })) // UnCSS cleans up unused CSS code, but relies on (static) HTML files in order to extract identifiers, might be interesting for thinning out frameworks.
      .pipe(plugins.postcss(processors)) // ♤ PostCSS ♤
      .pipe(gulpif(!confGlobal.isDevelop, plugins.minifyCss({
        compatibility: 'ie8'
      })))
      .pipe(gulpif(confGlobal.enableGZIP, plugins.gzip(confPlugins.gzipOptions)))
      .pipe(gulp.dest(path.dest + confFileMap.targetFolders.css))
      .pipe(reload({
        stream: true
      }));
  };
};
