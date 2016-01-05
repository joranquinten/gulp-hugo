module.exports = function(
  gulp, plugins, confFileMap
) {
  return function() {
    var path = confFileMap.env.dev;
    var base = path.base;

    plugins.watch(base + '' + confFileMap.watchFiles.css, function() {
      gulp.run(['css']);
    });

    plugins.watch(base + '' + confFileMap.watchFiles.js, function() {
      gulp.run(['js']);
    });

    plugins.watch(base + '' + confFileMap.watchFiles.html, function() {
      gulp.run(['html']);
    });

    plugins.watch(base + '' + confFileMap.watchFiles.images, function() {
      gulp.run(['img']);
    });
  };
};
