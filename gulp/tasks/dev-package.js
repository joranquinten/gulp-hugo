module.exports = function(
  gulp, plugins, confGlobal, confFileMap, notify, gulpif
) {
  return function() {
    if (confGlobal.packageModules) {
      var removeUseStrict = require('gulp-remove-use-strict');

      // get sourcefolder
      var sourceFolder = confFileMap.sourceFolders.packages;
      var postFix = '.'+ confFileMap.targetFiles.packagePostfix;

      // get each subfolder of sourcefolder
      var fs = require("fs"),
        path = require("path");

      var subFolders = getDirectories(sourceFolder);

      // get all *.js files, excluding *.spec.js & *.package.js
      subFolders.forEach(function(folderName) {
        var currentFolder = sourceFolder + '/' + folderName;
        // concat to targetname = sourcefolder.package.js, filter out certain files
        gulp.src([currentFolder + '/**/*.js', '!' + currentFolder + '/**/*.spec.js', '!' + currentFolder + '/**/*'+ postFix +'.js'])
          .pipe(plugins.concat(folderName + postFix + '.js'))
          .pipe(gulpif(!confGlobal.transformForAngular, plugins.ngAnnotate()))
          .pipe(removeUseStrict())
          .pipe(gulpif(!confGlobal.isDevelop, plugins.uglify({
            mangle: true
          })))
          .pipe(gulp.dest(currentFolder));
      });

    } else {
      notify('Packaging of modules disabled in global config.','title');
    }

    function getDirectories(p) {
      return fs.readdirSync(p).filter(function(file) {
        return fs.statSync(path.join(p, file)).isDirectory();
      });
    }
  };
};
