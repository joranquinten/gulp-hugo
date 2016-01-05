module.exports = function(
  gulp, isCleanedDev, del, confFileMap
) {
  return function() {
    isCleanedDev = true;
    return del(confFileMap.env.dev.dest);
  };
};
