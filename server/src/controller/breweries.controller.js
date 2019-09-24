/**
 * User: abhijit.baldawa
 *
 * This is controller module for /breweries route
 */

let
    breweriesModel,
    monitorTemperatureDaemon;

/**
 * @public
 *
 * This method accepts dependencies which the controller requires
 * to execute all methods
 *
 * @param {Object} args
 *     @param {Object} args.model - Database model
 *     @param {Object} args.daemon - Daemon module object
 *
 * @returns undefined
 */
function injectDependencies( args ) {
    const
        {model, daemon} = args;

    breweriesModel = model;
    monitorTemperatureDaemon = daemon;
}

/**
 * @public
 *
 * REST ENDPOINT: GET /breweries
 *
 * This method responds with breweries object
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getAllBreweries( req, res ) {
   res.json( breweriesModel.getBreweriesObject() );
}

/**
 * @public
 *
 * REST ENDPOINT: POST /startMonitoring
 *
 * This method starts monitoring and starts a temperature monitoring daemon
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function startMonitoring( req, res ) {
    if( breweriesModel.isMonitoring() ) {
        return res.send("ALREADY_MONITORING");
    }

    breweriesModel.startMonitoring();

    monitorTemperatureDaemon.start( {
        beers: breweriesModel.getAllBreweries()
    } );

    res.send( "STARTED" );
}

/**
 * @public
 *
 * REST ENDPOINT: POST /stopMonitoring
 *
 * This method stops monitoring and stop the temperature monitoring daemon
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function stopMonitoring( req, res ) {
    if( !breweriesModel.isMonitoring() ) {
        return res.send("NOT_MONITORING");
    }

    breweriesModel.stopMonitoring();
    monitorTemperatureDaemon.stop();
    res.send("STOPPED");
}

/**
 * @public
 *
 * REST ENDPOINT: GET /isMonitoring
 *
 * This method responds whether daemon is monitoring beers temperature
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function isMonitoring( req, res ) {
    res.json( {
        monitoring: breweriesModel.isMonitoring()
    } );
}

module.exports = {
    injectDependencies,
    getAllBreweries,
    startMonitoring,
    stopMonitoring,
    isMonitoring
};