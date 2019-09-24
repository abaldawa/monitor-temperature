/**
 * User: abhijit.baldawa
 */

const
    SocketIO = require('socket.io'),
    logger = require('../logger/logger'),
    {temperatureChange} = require('../../../common/socketEvents');

let
    io,
    connectedSockets = new Set();

function socketConnected( socket ) {
    connectedSockets.add(socket);
    logger.info(`socket.id = ${socket.id} connected to server. No of connected sockets = ${connectedSockets.size}`);

    socket.on('disconnect', function(){
        connectedSockets.delete( socket );
        logger.info(`socket.id = ${socket.id} disconnected. No of connected sockets = ${connectedSockets.size}`);
    });
}

function emitToAll( currentBeersTemperatureArr ) {
    if( connectedSockets.size ) {
        logger.info(`Notifying all connected sockets about current temperatures`);
        io.emit( temperatureChange.eventName, currentBeersTemperatureArr );
    }
}

function init(httpServer) {
    io = SocketIO(httpServer);
    io.on('connection', socketConnected);
}

module.exports = {
    init,
    emitToAll
};