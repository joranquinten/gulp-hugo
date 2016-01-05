module.exports = function(
  gulp, runSequence
) {
  return function() {
    runSequence('prod:nowatch', 'test:e2e');
  };
};
