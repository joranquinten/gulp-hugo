module.exports = function(
  gulp, confGlobal, confFileMap, confPlugins, browserSync, confLocal, notify
) {
  return function() {
    var env = confFileMap.env.dev.base;
    if (!confGlobal.isDevelop) env = confFileMap.env.prod.base;
    env = env.replace('./', '');

    notify('Serve assumes you have a local webserver running and content is accessible via localhost.', 'title');
    // Assumes you have a local webserver running and content is accessible via localhost by default

    var serverUrl, browserList;
    serverUrl = confPlugins.browserSync.proxy;
    browserList = confPlugins.browserSync.browsers;

    // Overwrite with local settings is applicable
    if (confLocal.server) serverUrl = confLocal.server;
    if (confLocal.browsers) browserList = confLocal.browsers;

    browserSync.init({
      server: false,
      proxy: serverUrl,
      browser: browserList
    });

    // Use static server:
    // browserSync.init({server: { baseDir: './' }, browser: browserList });
  };
};
