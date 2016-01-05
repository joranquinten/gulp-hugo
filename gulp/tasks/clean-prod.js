module.exports = function(
  gulp, isCleanedProd, del, confFileMap
) {
  return function() {
    isCleanedProd = true;
    return del(confFileMap.env.prod.dest);
  };
};
