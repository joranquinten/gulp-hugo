module.exports = function(
  gulp, plugins, confGlobal, confFileMap
) {
  return function() {
	  
    if (confGlobal.enableRevisioning) {
		
		var path = confFileMap.env.prod.dest;
		var manifest = confFileMap.targetFolders.revManifest;
		
		// Load files to be revisioned
		return gulp.src(path + '**/*.{css,js}')
		  .pipe(plugins.plumber({
			handleError: function(err) {
			  console.log(err);
			  this.emit('end');
			}
		  }))
		  .pipe(plugins.rev())
		  .pipe(gulp.dest(path))
		  .pipe(plugins.rev.manifest({
			path: confFileMap.targetFiles.revManifest
		  }))
		  .pipe(gulp.dest(manifest));
	  
	}
  };
};
