module.exports = function(
  gulp, confFileMap, confPlugins, notify
) {
  return function(done) {
    var karmaServer = require('karma').Server;

    notify('Starting unit tests. Note that this follow a watch pattern on testfiles, press Ctrl+C to quit.', 'title');

    var path = confFileMap.env.dev;
    var base = path.base,
      ref = confFileMap.sourceFiles.tests.unit;

    new karmaServer({
      confGlobalFile: __dirname + confPlugins.karma.configFile,
      singleRun: false
    }, done).start();
  };
};
