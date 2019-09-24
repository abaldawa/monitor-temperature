/**
 * User: abhijit.baldawa
 *
 * This module exposes methods to perform CRUD operations with (mock) database
 */

let
    breweriesJson;

function injectDependencies( args ) {
    const
        {breweriesDataJson} = args;

    breweriesJson = breweriesDataJson;
}

function startMonitoring() {
    breweriesJson.monitoring = true;
}

function stopMonitoring() {
    breweriesJson.monitoring = false;
}

function isMonitoring() {
    return breweriesJson.monitoring;
}

function getAllBreweries() {
    return breweriesJson.beers;
}

function getBreweriesObject() {
    return breweriesJson;
}

module.exports = {
    injectDependencies,
    startMonitoring,
    stopMonitoring,
    isMonitoring,
    getAllBreweries,
    getBreweriesObject
};