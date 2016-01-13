module.exports = function(
  gulp, confGlobal, runSequence
) {
  return function() {
    confGlobal.isDevelop = false;
    runSequence('clean:prod', ['js', 'css', 'img'], 'html', 'useref', 'rev');
  };
};
