module.exports = function(app) {
    var uuid = require('node-uuid');
    app.dataSources.storage.connector.getFilename = function(file, req, res) {
        var origFilename = file.name;
        var parts = origFilename.split('.'),
        extension = parts[parts.length-1];
        var newFilename = uuid.v1() + '.' + extension;
        return newFilename;
    };
}