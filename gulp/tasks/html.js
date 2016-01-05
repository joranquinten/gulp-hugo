module.exports = function(
  gulp, plugins, confGlobal, confFileMap, confPlugins, gulpif, reload, pathFiles
) {
  return function() {
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
  };
};
