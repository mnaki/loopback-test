'use strict';

module.exports = function(Video) {
	Video.observe('before delete', function(ctx, next) {
    Video.findById(ctx.where.id, function (err, instance) {
      console.log(instance)
      Video.app.models.Container.removeFile("video-container", instance.containerFilename)
    })
    next();
  });
};
