require('es6-promise').polyfill();

/* ****************************************************************************************************
*  Variables                                                                                          *
**************************************************************************************************** */

var confGlobal = require('./gulp/config/gulp-global.json');
var confFileMap = require('./gulp/config/gulp-filemap.json');
var confPlugins = require('./gulp/config/gulp-plugins.json');
var confLocal = require('./gulp/config/gulp-local.json');

var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
var runSequence = require('run-sequence');
var gulpif = require('gulp-if');
var del = require('del');
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

// Monitor cleaning process
var isCleanedDev = false;
var isCleanedProd = false;

/* ****************************************************************************************************
*  Helpers                                                                                            *
**************************************************************************************************** */

var ignorePath = function(base, file) {
  if (file.substring(0, 1) === '!') {
    return '!' + base + '' + file.replace('!', '');
  }
  return base + '' + file;
};

var currentDir = function() {
  if (__dirname) return __dirname.split('\\').pop();
};

var notify = function(msg, type) {
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
};

var pathFiles = function(base, collection) {
  if (typeof(collection) === 'object') {
    var ar = [];
    for (var i = 0; i < collection.length; i++) {
      ar.push(ignorePath(base, collection[i]));
    }
    return ar;
  } else if (typeof(collection) === 'string') {
    return ignorePath(base, collection);
  }
};

var fileExists = function(filepath){
  var fs = require('fs');
  try {
    file = fs.lstatSync(filepath);
    if (file.isFile()) {
      try {
        return true;
      } catch (e) {
        return false;
      }
    }
  } catch (e) {return false;
  }
};

/* ****************************************************************************************************
*                                                                                                     *
*  MAIN TASKS                                                                                         *
*                                                                                                     *
**************************************************************************************************** */

// Assuming default means develop
gulp.task('default', function() {
  runSequence('dev');
});

gulp.task('dev',           require('./gulp/tasks/dev.js')            (gulp, confGlobal, runSequence));
gulp.task('dev:nowatch',   require('./gulp/tasks/dev-nowatch.js')    (gulp, confGlobal, runSequence));
gulp.task('module:package',require('./gulp/tasks/module-package.js') (gulp, plugins, confGlobal, confFileMap, notify, gulpif));

gulp.task('prod',          require('./gulp/tasks/prod.js')           (gulp, confGlobal, runSequence));
gulp.task('prod:nowatch',  require('./gulp/tasks/prod-nowatch.js')   (gulp, confGlobal, runSequence));
gulp.task('prod:deploy',   require('./gulp/tasks/prod-deploy.js')    (gulp, confGlobal, runSequence));
gulp.task('prod:test',     require('./gulp/tasks/prod-test.js')      (gulp, runSequence));

gulp.task('clean:all',     require('./gulp/tasks/clean-all.js')      (gulp, runSequence));

/* Building by type */
gulp.task('js',            require('./gulp/tasks/js.js')             (gulp, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles));
gulp.task('css',           require('./gulp/tasks/css.js')            (gulp, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles));
gulp.task('html',          require('./gulp/tasks/html.js')           (gulp, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles));
gulp.task('img',           require('./gulp/tasks/img.js')            (gulp, plugins, confGlobal, confFileMap, gulpif, pathFiles));

/* Additional transforming */
gulp.task('usemin',        require('./gulp/tasks/usemin.js')         (gulp, plugins, confGlobal, confFileMap, confPlugins, pathFiles, reload));
gulp.task('rev',           require('./gulp/tasks/rev.js')            (gulp, runSequence));
gulp.task('rev:clean',     require('./gulp/tasks/rev-clean.js')      (gulp, confFileMap, notify, isCleanedProd));
gulp.task('rev:revision',  require('./gulp/tasks/rev-revision.js')   (gulp, plugins, confFileMap));
gulp.task('rev:manifest',  require('./gulp/tasks/rev-manifest.js')   (gulp, plugins, confGlobal, confFileMap));

/* Tests */
gulp.task('test:unit',     require('./gulp/tasks/test-unit.js')      (gulp, confFileMap, confPlugins, notify));
gulp.task('test:e2e',      require('./gulp/tasks/test-e2e.js')       (gulp, confFileMap, confPlugins, pathFiles, notify));

/* Utilities */
gulp.task('serve',         require('./gulp/tasks/serve.js')          (gulp, confGlobal, confFileMap, confPlugins, browserSync, confLocal, notify));
gulp.task('watch',         require('./gulp/tasks/watch.js')          (gulp, plugins, confFileMap));
gulp.task('zip',           require('./gulp/tasks/zip.js')            (gulp, plugins, confFileMap, currentDir));

gulp.task('clean:dev',     require('./gulp/tasks/clean-dev.js')      (gulp, isCleanedDev, del, confFileMap));
gulp.task('clean:prod',    require('./gulp/tasks/clean-prod.js')     (gulp, isCleanedProd, del, confFileMap));
gulp.task('clean:zip',     require('./gulp/tasks/clean-zip.js')      (gulp, confGlobal, del, confFileMap));
