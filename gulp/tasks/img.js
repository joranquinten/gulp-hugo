module.exports = function(
  gulp, plugins, confGlobal, confFileMap, gulpif, pathFiles
) {
  return function() {
    var pngquant = require('imagemin-pngquant');

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
  };
};
