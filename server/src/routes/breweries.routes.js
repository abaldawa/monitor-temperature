/**
 * User: abhijit.baldawa
 */

const
    router = require('express').Router();

let
    breweriesController;

function injectDependencies( args ) {
    ({breweriesController} = args);
}

function addRoutes() {
    router.get('/', [
        breweriesController.getAllBreweries
    ]);

    router.get('/isMonitoring', [
        breweriesController.isMonitoring
    ]);

    router.post('/startMonitoring', [
        breweriesController.startMonitoring
    ]);

    router.post('/stopMonitoring', [
        breweriesController.stopMonitoring
    ]);

    router.get('/currentTemperatures', [
       breweriesController.getCurrentBreweriesTemperature
    ]);
}

module.exports = {
    injectDependencies,
    addRoutes,
    router
};