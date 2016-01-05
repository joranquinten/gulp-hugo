module.exports = function(
  gulp, confGlobal, runSequence
) {
  return function() {
    confGlobal.isDevelop = false;
    runSequence(['clean:prod', 'clean:zip'], ['js', 'css', 'html', 'img'], 'usemin', 'rev', 'zip');
  };
};
