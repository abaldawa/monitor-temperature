/**
 * User: abhijit.baldawa
 *
 * Temperature monitoring daemon methods exposed by this module
 */

const
    {emitToAll} = require('../socket_server/socketIOServer'),
    {temperatureSensorService} = require('../services').getAll(),
    {formatPromiseResult} = require('../utils/util');

let
    intervalId;

/**
 * @public
 *
 * Calls the service to fetch random temperature of all the beers
 *
 * @param {Array.<{name: string, minimumTemperature: number, maximumTemperature: number, unit: string}>} beersArr
 * @returns {Promise<Array.<{
 *     name: string,
 *     minimumTemperature: number,
 *     maximumTemperature: number,
 *     unit: string,
 *     currentTemperature: string,
 *     safe: boolean
 * }>>}
 */
function monitorTemperature( beersArr ) {
    return Promise.all(
            beersArr.map( async beerObj => {
                let
                    err,
                    safe = false,
                    currentTempObj;

                [err, currentTempObj] = await formatPromiseResult( temperatureSensorService.getCurrentBeerTemperature( beerObj.name ) );

                if( err ) {
                    return {
                        ...beerObj,
                        currentTemperature: err.message,
                        safe
                    };
                }

                if( beerObj.minimumTemperature <= currentTempObj.temperature &&
                    beerObj.maximumTemperature >= currentTempObj.temperature ) {
                    safe = true;
                }

                return {
                    ...beerObj,
                    currentTemperature: `${currentTempObj.temperature}${beerObj.unit}`,
                    safe
                };
            } )
          );
}

/**
 * @public
 *
 * This method starts the daemon to monitor and emit current temperature of all the beers to the UI via socket after
 * every 10 seconds
 *
 * @param {Object} args
 *     @param {Array.<Object>} args.beers - All the beers whose temperatures needs to be monitored
 */
function start( args ) {
    const
        {beers} = args;

    intervalId = setInterval( async () => {
        emitToAll( await monitorTemperature( beers ) );
    }, 10000);
}

/**
 * @public
 * This method stops the daemon
 */
function stop() {
    clearInterval(intervalId);
}

module.exports = {
    start,
    stop,
    monitorTemperature
};