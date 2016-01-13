module.exports = function(
  gulp, confFileMap, confPlugins, notify, fileExists
) {
  return function(done) {
    var karmaServer = require('karma').Server;

    notify('Starting unit tests. Note that this follow a watch pattern on testfiles, press Ctrl+C to quit.', 'title');

    var path = confFileMap.env.dev;
    var base = path.base,
      ref = confFileMap.sourceFiles.tests.unit;

    new karmaServer({
      configFile: __dirname + confPlugins.karma.configFile,
      files: ref,
      browsers: confPlugins.karma.browsers,
      singleRun: true
    }, done).start();
  };
};
