/**
 * User: abhijit.baldawa
 */

const
    {temperatureSensorApis} = require('./servicesEndPoints'),
    temperatureSensorService = require('./temperatureSensor.service');

function init() {
    temperatureSensorService.injectDependencies({
        temperatureSensorApis
    });
}

function getAll() {
    return {
        temperatureSensorService
    }
}

module.exports = {
    init,
    getAll
};