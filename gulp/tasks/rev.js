module.exports = function(
  gulp, runSequence
) {
  return function() {
    runSequence('rev:clean','rev:revision','rev:manifest');
  };
};
