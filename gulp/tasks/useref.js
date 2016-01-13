module.exports = function(
  gulp, plugins, confGlobal, confFileMap, confPlugins, pathFiles, reload, gulpif
) {
  return function() {
    if (confGlobal.enableUseref) {
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

        .pipe(plugins.useref())
        .pipe(gulpif('*.js', plugins.uglify()))
        .pipe(gulpif('*.css', plugins.minifyCss()))
/*
        .pipe(plugins.useref({
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
*/

        .pipe(gulp.dest(path.dest + confFileMap.targetFolders.html))
        .pipe(reload({
          stream: true
        }));
    }
  };
};
