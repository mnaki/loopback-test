'use strict';

module.exports = function(VideoFile) {
	VideoFile.beforeRemote('upload', function(context, comment, next) {
		console.log(context.req.files)
		next()
	})
};
