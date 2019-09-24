/**
 * User: abhijit.baldawa
 */

const
    breweriesRoutes = require('./breweries.routes'),
    {breweriesController} = require('../controller/index').getAll();

function init() {
    breweriesRoutes.injectDependencies({
        breweriesController
    });

    breweriesRoutes.addRoutes();
}

function getAll() {
    return {
        breweriesRoutes
    }
}

module.exports = {
    init,
    getAll
};