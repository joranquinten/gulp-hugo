module.exports = function(
  gulp, confFileMap, confPlugins, pathFiles, notify
) {
  return function() {

    var protractor = require("gulp-protractor").protractor;

    var path = confFileMap.env.dev;
    var base = path.base,
      ref = confFileMap.sourceFiles.tests.e2e;

    gulp.src(pathFiles(base, ref))
      .pipe(protractor({
        confGlobalFile: '.' + confPlugins.protractor.configFile,
        args: ['--baseUrl', 'http://127.0.0.1:8000']
      }))
      .on('error', function(err) {
        this.emit('end');
      });

    notify('Starting end to end tests. Note that this starts up a browser and could take a while, press Ctrl+C to quit.', 'title');
  };
};
