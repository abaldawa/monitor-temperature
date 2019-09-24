/**
 * User: abhijit.baldawa
 *
 * This module exposes methods to fetch environment variables, process arguments and configuration values from serverConfig.json file.
 */

const
    {httpServer} = require('./serverConfig');

/**
 * @public
 *
 * This method returns the port number on which the server should run
 *
 * @returns {number}
 */
function getPort() {
    if( process.env.PORT ) {
        return process.env.PORT;
    } else {
        return httpServer.port;
    }
}

module.exports = {
    getPort
};