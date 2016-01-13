module.exports = function(
  gulp, confGlobal, confFileMap, notify, isCleanedProd
) {
  return function() {
    if (confGlobal.enableRevisioning) {
		// if already cleaned, no need to clean up a second time
		if (!isCleanedProd ) {
		  var path = confFileMap.env.prod.dest;
		  var manifest = '../'+confFileMap.targetFolders.revManifest + confFileMap.targetFiles.revManifest;
		  var manifestFile = null;

		  var fs = require('fs');
		  try {
			file = fs.lstatSync(manifest);
			if (file.isFile()) {
			  try {
				manifestFile = require(manifest);
			  } catch (e) {
				notify('Could not open ' + manifest + ' in: ' + __dirname, 'error');
			  }
			}
		  } catch (e) {
			// do nothing
		  }

		  if (manifestFile) {
			notify('Manifest opened, starting to delete files.', 'warning');
			for (var files in manifestFile) {
			  if (manifestFile.hasOwnProperty(files)) {
				try {
				  fs.unlink(confFileMap.env.prod.dest + manifestFile[files]);
				} catch (e) {
				  notify('Could not delete: ' + manifestFile[files], 'error');
				}
			  }
			}
		  }
		} else {
		  notify('Production environment was already cleaned. Skipping.', 'warning');
		}
	}
  };
};
