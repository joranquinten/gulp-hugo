module.exports = function(
  gulp, runSequence
) {
  return function() {
    runSequence(['clean:dev', 'clean:prod']);
  };
};
