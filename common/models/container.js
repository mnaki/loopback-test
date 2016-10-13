'use strict';
var async = require('async');

module.exports = function (Container) {
	Container.afterRemote('upload', function(context, instance, next) {
		async.each(instance.result.files.file, (file, cb) => {
			Container.app.models.Video.create({
				"ownerId": JSON.parse(context.req.cookies.currentToken).userId,
				"length": 0,
				"size": 0,
				"isPublic": true,
				"filename": '/api/Containers/video-container/download/' + file.name
			}, cb)
		}, function (err) {
			if (err) console.log(err)
			else next()
		})
	})
};
