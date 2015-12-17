require('es6-promise').polyfill();

var confGlobal = require('./config/gulp-global.json');
var confFileMap = require('./config/gulp-filemap.json');
var confPlugins = require('./config/gulp-plugins.json');
var confLocal = require('./config/gulp-local.json');

var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
var runSequence = require('run-sequence');
var pngquant = require('imagemin-pngquant');
var gulpif = require('gulp-if');
var del = require('del');
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

// Monitor cleaning process
var isCleanedDev = false;
var isCleanedProd = false;

// Testing plugins
var karmaServer = require('karma').Server;
var protractor = require("gulp-protractor").protractor;

// PostCSS Plugins
var autoprefixer = require('autoprefixer');
var cssgrace = require('cssgrace');
var pseudoelements = require('postcss-pseudoelements');

// Assuming default means develop
gulp.task('default', function() {
  runSequence('dev');
});

gulp.task('dev', function() {
  confGlobal.isDevelop = true;
  runSequence('clean:dev', ['js', 'css', 'html', 'img'], ['serve', 'watch']);
});

gulp.task('dev:nowatch', function() {
  confGlobal.isDevelop = true;
  runSequence('clean:dev', ['js', 'css', 'html', 'img']);
});

gulp.task('prod', function() {
  confGlobal.isDevelop = false;
  runSequence('clean:prod', ['js', 'css', 'html', 'img'], 'usemin', 'rev', ['serve', 'watch']);
});

gulp.task('prod:nowatch', function() {
  confGlobal.isDevelop = false;
  runSequence('clean:prod', ['js', 'css', 'html', 'img'], 'usemin', 'rev');
});

gulp.task('prod:deploy', function() {
  confGlobal.isDevelop = false;
  runSequence(['clean:prod', 'clean:zip'], ['js', 'css', 'html', 'img'], 'usemin', 'rev', 'zip');
});

gulp.task('prod:test', function() {
  runSequence('prod:nowatch', 'e2e');
});

gulp.task('clean:all', function() {
  runSequence(['clean:dev', 'clean:prod']);
});

/*
Tasks by type
*/
gulp.task('js', function() {

  var path = confFileMap.env.dev;
  if (!confGlobal.isDevelop) path = confFileMap.env.prod;
  var base = path.base,
    ref = confFileMap.sourceFiles.js;

  if (confGlobal.cleanBeforeRun) {
    console.log('deleting: ' + path.dest + confFileMap.targetFolders.js + '**/*.js');
    del(path.dest + confFileMap.targetFolders.js + '**/*.js');
  }
  var sourcemaps = require('gulp-sourcemaps');
  var removeUseStrict = require('gulp-remove-use-strict');

  return gulp.src(pathFiles(base, ref))
    .pipe(plugins.plumber({
      handleError: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(plugins.jshint(confPlugins.jshintOptions))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.concat(confFileMap.targetFiles.js))
    .pipe(gulpif(!confGlobal.transformForAngular, plugins.ngAnnotate()))
    .pipe(removeUseStrict())
    .pipe(gulpif(!confGlobal.isDevelop, plugins.uglify({
      mangle: true
    })))
    .pipe(gulpif(!confGlobal.isDevelop, plugins.stripDebug()))
    .pipe(gulpif(confGlobal.enableGZIP, plugins.gzip(confPlugins.gzipOptions)))
    .pipe(sourcemaps.write(confFileMap.targetFolders.maps, {
      includeContent: false
    }))
    .pipe(gulp.dest(path.dest + confFileMap.targetFolders.js))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('css', function() {

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
});

gulp.task('html', function() {

  var path = confFileMap.env.dev;
  if (!confGlobal.isDevelop) path = confFileMap.env.prod;
  var base = path.base,
    ref = confFileMap.sourceFiles.html;

  if (confGlobal.cleanBeforeRun) {
    console.log('deleting: ' + path.dest + confFileMap.targetFolders.html + '**/*.{html,htm,xml,txt}');
    del(path.dest + confFileMap.targetFolders.html + '**/*.{html,htm,xml,txt}');
  }

  return gulp.src(pathFiles(base, ref))
    .pipe(plugins.plumber({
      handleError: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(gulpif(!confGlobal.isDevelop, plugins.htmlmin(confPlugins.minifyHTML)))
    .pipe(gulpif(confGlobal.enableGZIP, plugins.gzip(confPlugins.gzipOptions)))
    .pipe(gulp.dest(path.dest + confFileMap.targetFolders.html))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('img', function() {

  var path = confFileMap.env.dev;
  if (!confGlobal.isDevelop) path = confFileMap.env.prod;
  var base = path.base,
    ref = confFileMap.sourceFiles.images;

  if (confGlobal.cleanBeforeRun) {
    console.log('deleting: ' + path.dest + confFileMap.targetFolders.images + '**/*.{gif,png,jpeg,jpg,svg}');
    del(path.dest + confFileMap.targetFolders.images + '**/*.{gif,png,jpeg,jpg,svg}');
  }

  return gulp.src(pathFiles(base, ref))
    .pipe(gulpif(!confGlobal.isDevelop, plugins.imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))) // Minify only on prod
    .pipe(gulp.dest(path.dest + confFileMap.targetFolders.images));
});

gulp.task('usemin', function() {
  if (confGlobal.enableUsemin) {
    var path = confFileMap.env.dev;
    if (!confGlobal.isDevelop) path = confFileMap.env.prod;
    var base = path.base,
      ref = confFileMap.sourceFiles.html;

    return gulp.src(pathFiles(base, ref))
      .pipe(plugins.plumber({
        handleError: function(err) {
          console.log(err);
          this.emit('end');
        }
      }))
      .pipe(plugins.usemin({
        css: [plugins.minifyCss({
          compatibility: 'ie8'
        })],
        html: [function() {
          return plugins.htmlmin(confPlugins.minifyHTML);
        }],
        js: [plugins.uglify],
        inlinejs: [plugins.uglify],
        inlinecss: [plugins.minifyCss({
          compatibility: 'ie8'
        })]
      }))
      .pipe(gulp.dest(path.dest + confFileMap.targetFolders.html))
      .pipe(reload({
        stream: true
      }));

  }
});

gulp.task('rev', ['revision'], function() {
  if (confGlobal.enableRevisioning) {

    var path = confFileMap.env.prod.dest;
    var manifest = gulp.src(confFileMap.targetFolders.revManifest + 'rev-manifest.json');

    return gulp.src(path + confFileMap.sourceFiles.html)
      .pipe(plugins.revReplace({
        manifest: manifest
      }))
      .pipe(gulp.dest(path + confFileMap.targetFolders.html));
  }
});

gulp.task('revision', ['revision:cleanBeforeRun'], function() {

  var path = confFileMap.env.prod.dest;
  var manifest = confFileMap.targetFolders.revManifest;

  // Load files to be revisioned
  return gulp.src(path + '**/*.{css,js}')
    .pipe(plugins.plumber({
      handleError: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(plugins.rev())
    .pipe(gulp.dest(path))
    .pipe(plugins.rev.manifest({
      path: confFileMap.targetFiles.revManifest
    }))
    .pipe(gulp.dest(manifest));

});

gulp.task('revision:cleanBeforeRun', function() {

  // if already cleaned, no need to clean up a second time
  if (!isCleanedProd) {
    var path = confFileMap.env.prod.dest;
    var manifest = confFileMap.targetFolders.revManifest + confFileMap.targetFiles.revManifest;
    var manifestFile = null;


    var fs = require('fs');
    try {
      file = fs.lstatSync(manifest);
      if (file.isFile()) {
        try {
          manifestFile = require(manifest);
        } catch (e) {
          notify('Could not open ' + manifest + ' in: ' + __dirname, 'error');
        }
      }
    } catch (e) {
      // do nothing
    }

    if (manifestFile) {
      notify('Manifest opened, starting to delete files.', 'warning');
      for (var files in manifestFile) {
        if (manifestFile.hasOwnProperty(files)) {
          try {
            fs.unlink(confFileMap.env.prod.dest + manifestFile[files]);
          } catch (e) {
            notify('Could not delete: ' + manifestFile[files], 'error');
          }
        }
      }
    }

  } else {
    notify('Production environment was already cleaned. Skipping.', 'warning');
  }

});


/* **************************************************
 *  Tests                                            *
 ************************************************** */

gulp.task('unit', function(done) {

  notify('Starting unit tests. Note that this follow a watch pattern on testfiles, press Ctrl+C to quit.', 'title');

  var path = confFileMap.env.dev;
  var base = path.base,
    ref = confFileMap.sourceFiles.tests.unit;

  new karmaServer({
    confGlobalFile: __dirname + confPlugins.karma.configFile,
    singleRun: false
  }, done).start();

});

gulp.task('e2e', function() {

  var path = confFileMap.env.dev;
  var base = path.base,
    ref = confFileMap.sourceFiles.tests.e2e;

  gulp.src(pathFiles(base, ref))
    .pipe(protractor({
      confGlobalFile: __dirname + confPlugins.protractor.configFile,
      args: ['--baseUrl', 'http://127.0.0.1:8000']
    }))
    .on('error', function(err) {
      this.emit('end');
    });

  notify('Starting end to end tests. Note that this starts up a browser and could take a while, press Ctrl+C to quit.', 'title');
});

/*
Utilities
*/
gulp.task('serve', function() {
  var env = confFileMap.env.dev.base;
  if (!confGlobal.isDevelop) env = confFileMap.env.prod.base;
  env = env.replace('./', '');

  notify('Serve assumes you have a local webserver running and content is accessible via localhost.', 'title');
  // Assumes you have a local webserver running and content is accessible via localhost by default

  var serverUrl, browserList;
  serverUrl = confPlugins.browserSync.proxy;
  browserList = confPlugins.browserSync.browsers;

  // Overwrite with local settings is applicable
  if (confLocal.server) serverUrl = confLocal.server;
  if (confLocal.browsers) browserList = confLocal.browsers;

  browserSync.init({
    server: false,
    proxy: serverUrl,
    browser: browserList
  });

  // Use static server:
  // browserSync.init({server: { baseDir: './' }, browser: browserList });

});

gulp.task('watch', function() {

  var path = confFileMap.env.dev;
  var base = path.base;

  plugins.watch(base + '' + confFileMap.watchFiles.css, function() {
    gulp.run(['css']);
  });

  plugins.watch(base + '' + confFileMap.watchFiles.js, function() {
    gulp.run(['js']);
  });

  plugins.watch(base + '' + confFileMap.watchFiles.html, function() {
    gulp.run(['html']);
  });

  plugins.watch(base + '' + confFileMap.watchFiles.images, function() {
    gulp.run(['img']);
  });

});

gulp.task('clean:dev', function() {
  isCleanedDev = true;
  return del(confFileMap.env.dev.dest);
});


gulp.task('clean:prod', function() {
  isCleanedProd = true;
  return del(confFileMap.env.prod.dest);
});

gulp.task('clean:zip', function() {
  if (confGlobal.cleanArchiveBeforeDeploy) {
    return del(confFileMap.targetFolders.zip + '**/*.zip');
  }
});

gulp.task('zip', function() {
  var targetName = confFileMap.targetFiles.zip;

  var rightNow = new Date();
  var res = rightNow.toISOString().slice(0, 17).replace(/-/g, "").replace(/T/g, "").replace(/:/g, "");
  if (!targetName) targetName = currentDir() + '.' + res + '.zip';
  return gulp.src(confFileMap.sourceFiles.zip)
    .pipe(plugins.zip(targetName))
    .pipe(gulp.dest(confFileMap.targetFolders.zip));
});

/* Other helpers */
function currentDir() {
  if (__dirname) return __dirname.split('\\').pop();
}

function notify(msg, type) {
  if (typeof(plugins.util) !== undefined) {
    switch (type) {
      case 'warning':
        plugins.util.log(plugins.util.colors.yellow(msg));
        break;
      case 'error':
        plugins.util.log(plugins.util.colors.bgRed(msg));
        break;
      case 'success':
        plugins.util.log(plugins.util.colors.green(msg));
        break;
      case 'title':
        plugins.util.log(plugins.util.colors.blue(msg));
        break;
      default:
        plugins.util.log(plugins.util.colors.cyan(msg));
    }
  } else {
    if (type !== undefined) msg = '[' + type + ']: ' + msg;
    console.log(msg);
  }
}

function pathFiles(base, collection) {
  if (typeof(collection) === 'object') {
    var ar = [];
    for (var i = 0; i < collection.length; i++) {
      ar.push(ignorePath(base, collection[i]));
    }
    return ar;
  } else if (typeof(collection) === 'string') {
    return ignorePath(base, collection);
  }
}

function ignorePath(base, file) {
  if (file.substring(0, 1) === '!') {
    return '!' + base + '' + file.replace('!', '');
  }
  return base + '' + file;
}
