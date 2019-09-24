/**
 * User: abhijit.baldawa
 */

const
    {emitToAll} = require('../socket_server/socketIOServer'),
    {temperatureSensorService} = require('../services').getAll(),
    {formatPromiseResult} = require('../utils/util');

let
    intervalId;

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

function start( args ) {
    const
        {beers} = args;

    intervalId = setInterval( async () => {
        emitToAll( await monitorTemperature( beers ) );
    }, 10000);
}

function stop() {
    clearInterval(intervalId);
}

module.exports = {
    start,
    stop,
    monitorTemperature
};