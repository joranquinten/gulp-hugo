module.exports = function(
  gulp, plugins, confGlobal, confFileMap
) {
  return function() {
    if (confGlobal.enableRevisioning) {

      var path = confFileMap.env.prod.dest;
      var manifest = gulp.src(confFileMap.targetFolders.revManifest + 'rev-manifest.json');

      return gulp.src(path + confFileMap.sourceFiles.html)
        .pipe(plugins.revReplace({
          manifest: manifest
        }))
        .pipe(gulp.dest(path + confFileMap.targetFolders.html));
    }
  };
};
