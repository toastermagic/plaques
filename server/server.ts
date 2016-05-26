/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
console.info('Node starts in %s mode', app.get('env'));

var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app, server);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

var sf = require('./components/sockets')(server);

// io.sockets.on('connection', function (socket) {
//     console.log('socket connection', socket);
//     socket.emit('news', { hello: 'world' });
//     socket.on('my other event', function (data) {
//         console.log(data);
//     });
// });

// Expose app
exports = module.exports = app;
