module.exports = function(
  gulp, confGlobal, runSequence
) {
  return function() {
    confGlobal.isDevelop = false;
    runSequence('clean:prod', ['js', 'css', 'html', 'img'], 'usemin', 'rev', ['serve', 'watch']);
  };
};
