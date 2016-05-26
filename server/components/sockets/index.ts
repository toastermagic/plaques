'use strict';

var _ = require('lodash');

var repo = require('../repository');
var ChunkLength = 10;

var SocketFactory = function(server) {
    var io = require('socket.io')(server);
    
    io.on('connection', function(socket) {
       console.log('socket connected', socket.id); 

        socket.on('streamRq', function(searchTerm) {
            console.log('streamRq', searchTerm);
            var rowCache = null;
            
            var startCallback = function() {
                console.log('stream requested', searchTerm);
            }
            
            var rowCallback = function(row) {
                if (rowCache === null) {
                    console.info('sending first');
                    socket.emit('newPlaque', row);
                    rowCache = [];
                    return;
                }
                
                rowCache.push(row);
                
                if(rowCache.length > ChunkLength) {
                    console.info('sending chunk', ChunkLength);
                    socket.emit('newPlaques', rowCache);
                    rowCache = [];
                }
            }

            var endCallback = function(numRows) {
                if (rowCache !== null && rowCache.length > 0)
                {
                    console.info('sending final chunk', rowCache.length);
                    socket.emit('newPlaques', rowCache);
                }
                socket.emit('searchComplete', numRows);
            }
            
            repo.stream(searchTerm, startCallback, rowCallback, endCallback);
        })
    });
}

module.exports = SocketFactory;