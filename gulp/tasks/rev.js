module.exports = function(
  gulp, confGlobal, runSequence
) {
  return function() {
    if (confGlobal.enableRevisioning) {
		runSequence('rev:clean','rev:revision','rev:manifest');
	}
  };
};
