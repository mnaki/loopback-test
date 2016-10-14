'use strict';

module.exports = function(Video) {
	Video.observe('before delete', function(ctx, next) {
    Video.findById(ctx.where.id, function (err, instance) {
      if (err) console.log(err)
      Video.app.models.Container.removeFile("video-container", instance.containerFilename)
    })
    next();
  });
};
