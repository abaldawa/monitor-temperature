/**
 * User: abhijit.baldawa
 */

let
    breweriesModel,
    monitorTemperatureDaemon;

function injectDependencies( args ) {
    const
        {model, daemon} = args;

    breweriesModel = model;
    monitorTemperatureDaemon = daemon;
}

function getAllBreweries( req, res ) {
   res.json( breweriesModel.getBreweriesObject() );
}

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

function stopMonitoring( req, res ) {
    if( !breweriesModel.isMonitoring() ) {
        return res.send("NOT_MONITORING");
    }

    breweriesModel.stopMonitoring();
    monitorTemperatureDaemon.stop();
    res.send("STOPPED");
}

function isMonitoring( req, res ) {
    res.json( {
        monitoring: breweriesModel.isMonitoring()
    } );
}

async function getCurrentBreweriesTemperature( req, res ) {
    res.json( await monitorTemperatureDaemon.monitorTemperature(breweriesModel.getAllBreweries()) );
}

module.exports = {
    injectDependencies,
    getAllBreweries,
    startMonitoring,
    stopMonitoring,
    isMonitoring,
    getCurrentBreweriesTemperature
};