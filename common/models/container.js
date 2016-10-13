'use strict';
var async = require('async');

module.exports = function (Container) {
	Container.afterRemote('upload', function(context, instance, next) {
		async.each(instance.result.files, (file, cb) => {
			console.log(context.req.cookies)
			let obj = {
				"ownerId": JSON.parse(context.req.cookies.currentToken).userId,
				"length": 0,
				"size": file[0].size,
				"isPublic": true,
				"filename": file[0].name
			}
			Container.app.models.Video.create(obj, cb)
			console.log(obj)
		})
		next()
	})
};
