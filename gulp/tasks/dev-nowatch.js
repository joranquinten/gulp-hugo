module.exports = function(
  gulp, confGlobal, runSequence
) {
  return function() {
    confGlobal.isDevelop = true;
    runSequence('clean:dev', ['js', 'css', 'html', 'img']);
  };
};
