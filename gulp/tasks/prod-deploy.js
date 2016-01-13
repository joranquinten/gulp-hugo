module.exports = function(
  gulp, confGlobal, runSequence
) {
  return function() {
    confGlobal.isDevelop = false;
    runSequence(['clean:prod', 'clean:zip'], ['js', 'css', 'img'], 'useref', 'rev', 'html', 'zip');
  };
};
