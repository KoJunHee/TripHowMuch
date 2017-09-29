'use strict';

var FS = require('fs');

module.exports = function (server) {
    // get routes
    var routePath = __dirname;
    var files = FS.readdirSync(routePath);
    for (var i = 0; i < files.length; i++) {
        if (files[i] !== 'index.js') {
            server.route(require('./' + files[i]));
        }
    }
};
