module.exports = function(
  gulp, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles
) {
  return function() {
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
  };
};
