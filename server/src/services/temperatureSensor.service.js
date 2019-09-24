/**
 * User: abhijit.baldawa
 */

const
    http = require('http'),
    https = require('https'),
    {formatPromiseResult} = require('../utils/util');

let
    TEMPERATURE_SENSOR_URL;

function injectDependencies( args ) {
    const
        {temperatureSensorApis} = args;

    ({TEMPERATURE_SENSOR_URL} = temperatureSensorApis);
}

async function fetchJsonDataFromUrl( URL ) {
    if( !URL || typeof URL !== "string" ) {
        throw new Error("Missing/invalid URL");
    }

    const
        request = URL.startsWith("https://") ? https : http;

    let
        err,
        httpResponse,
        responseStr = '',
        responseJson;

    // ----------------------- 1. Initiate http(s) get request on URL and get httpResponse stream or error ------------------
    [err, httpResponse] = await formatPromiseResult(
                                   new Promise((resolve, reject) => {
                                       request
                                           .get( URL, resolve )
                                           .on('error', reject)
                                   })
                                );

    if(err) {
        throw new Error(`Error fetching data from URL = '${URL}'. Error: ${err}`);
    }

    if( httpResponse.statusCode !== 200 ) {
        throw new Error(`Unsuccessful status code received from the URL = '${URL}'. Status code = ${httpResponse.statusCode}`);
    }
    // -------------------------------------------------- 1. END --------------------------------------------------------------


    // ---------- 2. Build the response JSON string by asynchronously iterating httpResponse ------------
    httpResponse.setEncoding('utf8');

    for await (const chunk of httpResponse) {
        responseStr += chunk;
    }
    // --------------------------------------------- 2. END ---------------------------------------------


    // ---------------------------- 3. Parse the JSON 'responseStr' and check if its valid ------------------
    [err, responseJson] = await formatPromiseResult( Promise.resolve().then(()=>JSON.parse(responseStr)) );

    if(err) {
        throw new Error(`Invalid JSON response received from URL='${URL}'. Error = ${err}`);
    }
    // ---------------------------------------------- 3. END ------------------------------------------------

    return responseJson;
}

async function getCurrentBeerTemperature( beerName ) {
    if( !beerName || typeof beerName !== "string" ) {
        throw new Error(`Invalid/Missing 'beerName'`);
    }

    const SENSOR_URL = TEMPERATURE_SENSOR_URL.replace("$deviceName", beerName);
    return fetchJsonDataFromUrl( SENSOR_URL );
}

module.exports = {
    injectDependencies,
    getCurrentBeerTemperature
};