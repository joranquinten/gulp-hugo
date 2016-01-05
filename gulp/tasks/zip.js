module.exports = function(
  gulp, plugins, confFileMap, currentDir
) {
  return function() {
    var targetName = confFileMap.targetFiles.zip;

    var rightNow = new Date();
    var res = rightNow.toISOString().slice(0, 17).replace(/-/g, "").replace(/T/g, "").replace(/:/g, "");
    if (!targetName) targetName = currentDir() + '.' + res + '.zip';
    return gulp.src(confFileMap.sourceFiles.zip)
      .pipe(plugins.zip(targetName))
      .pipe(gulp.dest(confFileMap.targetFolders.zip));
  };
};
