/**
 * User: abhijit.baldawa
 */

const
    breweriesController = require('./breweries.controller'),
    {breweriesModel} = require('../database/models').getAll(),
    monitorTemperatureDaemon = require('../daemon/monitorTemperature');

function init() {
    breweriesController.injectDependencies({
        model: breweriesModel,
        daemon: monitorTemperatureDaemon
    });
}

function getAll() {
    return {
        breweriesController
    }
}

module.exports = {
    init,
    getAll
};