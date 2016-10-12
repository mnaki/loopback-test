'use strict';
var async = require('async');

module.exports = function (Container) {
	Container.afterRemote('upload', function(context, instance, next) {
		async.each(instance.result.files, (file, cb) => {
			Container.app.models.Video.create({
				"ownerId": 2,
				"length": 0,
				"size": file[0].size,
				"isPublic": true,
				"filename": file[0].name
			}, cb)
		})
		next()
	})
};
