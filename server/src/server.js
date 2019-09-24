/**
 * User: abhijit.baldawa
 */

const
    express = require('express'),
    http = require('http'),
    path = require('path'),
    services = require('./services'),
    dbModels = require('./database/models'),
    controllers = require('./controller'),
    routes = require('./routes'),
    logger = require('./logger/logger'),
    socketIOServer = require('./socket_server/socketIOServer'),
    {formatPromiseResult} = require('./utils/util'),
    {getPort} = require('./config/config'),
    app = express(),
    httpServer = http.createServer(app);

/**
 * Immediately invoking async method which does all the standard server startup routine.
 */
(async () =>{
    const
        PORT = getPort();

    let
        err,
        breweriesRoutes;

    if( !PORT ) {
        logger.error(`Cannot start server as port information is missing`);
        process.exit(1);
    }

    // --------------------- 1. Add all the required express middleware ---------------------
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "..","..", "client", "dist")));
    // ---------------------------- 1. END -------------------------------------------------


    // ------------------ 2. Initialise application dependencies ---------------------------
    services.init();
    dbModels.init();
    controllers.init();
    routes.init();
    // ---------------------------------- 2. END ------------------------------------------


    // ---------------------------- 3. Add express routes ----------------------------------
    ({breweriesRoutes} = routes.getAll());

    app.use('/breweries', breweriesRoutes.router);
    // -------------------------------------- 3. END ---------------------------------------


    // ----------------------------- 4. Initialise socket IO server ----------------
    socketIOServer.init(httpServer);
    // ------------------------------------------- 4. END --------------------------


    // ------------------------------ 5. Start Http Server -------------------------------------------
    [err] = await formatPromiseResult(
                    new Promise( (resolve, reject) => {
                        httpServer
                            .listen(PORT, () => {
                                resolve();
                            })
                            .on('error', reject)
                    } )
                  );

    if( err ) {
        logger.error(`Error while starting server on port = ${PORT}. Error: ${err.stack || err}. Exiting...`);
        process.exit(1);
    }

    logger.info(`Server is listening on port = ${PORT}`);
    // --------------------------------- 5. END -------------------------------------------------------
})();