module.exports = function(
  gulp, confGlobal, del, confFileMap
) {
  return function() {
    if (confGlobal.cleanArchiveBeforeDeploy) {
      return del(confFileMap.targetFolders.zip + '**/*.zip');
    }
  };
};
