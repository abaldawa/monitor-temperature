/**
 * User: abhijit.baldawa
 *
 * This module initializes all db models
 */

const
    breweriesDataJson = require('../sampleData/breweries'),
    breweriesModel = require('./breweries.model');

function init() {
    // ----------------------- 1. Init breweries model -------------------------------
    breweriesModel.injectDependencies({
        breweriesDataJson
    });
    // -------------------------------- 1. END -----------------------------------------
}

function getAll() {
    return {
        breweriesModel
    };
}

module.exports = {
    init,
    getAll
};