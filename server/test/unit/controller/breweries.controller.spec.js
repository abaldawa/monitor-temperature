/**
 * User: abhijit.baldawa
 */

const
    breweriesController = require('../../../src/controller/breweries.controller'),
    breweriesModel = require('../../../src/database/models/breweries.model'),
    breweriesDataJson = require('../../../src/database/sampleData/breweries');

describe("Module controller/breweries.controller.js", function() {
    let
        monitorTemperatureDaemonMock = {};

    before(function() {
        breweriesModel.injectDependencies({breweriesDataJson});
        breweriesController.injectDependencies({
            model: breweriesModel,
            daemon: monitorTemperatureDaemonMock
        });
    });

    describe("#getAllBreweries", function() {
        it("should respond with JSON object containing 'monitoring' and 'beers' keys and have valid beer objects", function(done) {
            const
                res = {
                    json( breweriesJson ) {
                        should.exist(breweriesJson);
                        breweriesJson.should.be.an("object");
                        breweriesJson.should.have.all.keys("monitoring", "beers");
                        breweriesJson.monitoring.should.be.an("boolean");
                        breweriesJson.beers.should.be.an("array");

                        breweriesJson.beers.forEach( beerObj => {
                            should.exist(beerObj);
                            beerObj.should.be.an("object");
                            beerObj.should.have.all.keys("name", "minimumTemperature", "maximumTemperature", "unit");
                            beerObj.name.should.be.an("string");
                            beerObj.minimumTemperature.should.be.an("number");
                            beerObj.maximumTemperature.should.be.an("number");
                            beerObj.unit.should.be.an("string");
                        } );
                        done();
                    }
                };

            breweriesController.getAllBreweries({}, res);
        });
    });

    describe("#startMonitoring()", function() {
        it("should start monitoring when hit for the first time and should start daemon", function( done ) {
            const
                res = {
                    send( statusText ) {
                        should.exist( statusText );
                        statusText.should.be.an("string");
                        statusText.should.equal("STARTED");
                        done();
                    }
                };

            monitorTemperatureDaemonMock.start = ( obj ) => {
                should.exist(obj);
                obj.should.be.an("object");
                obj.should.have.all.keys("beers");
                obj.beers.should.be.an("array");

                obj.beers.forEach( beerObj => {
                    should.exist(beerObj);
                    beerObj.should.be.an("object");
                    beerObj.should.have.all.keys("name", "minimumTemperature", "maximumTemperature", "unit");
                    beerObj.name.should.be.an("string");
                    beerObj.minimumTemperature.should.be.an("number");
                    beerObj.maximumTemperature.should.be.an("number");
                    beerObj.unit.should.be.an("string");
                } );
            };

            breweriesController.startMonitoring({}, res);
        });

        it("if clicked again then daemon should not start again and UI should be notified", function(done) {
            const
                res = {
                    send( statusText ) {
                        should.exist( statusText );
                        statusText.should.be.an("string");
                        statusText.should.equal("ALREADY_MONITORING");
                        done();
                    }
                };

            breweriesController.startMonitoring({}, res);
        });
    });

    describe("#isMonitoring()", function() {
        it(`should respond monitoring as true`, function(done) {
            const
                res = {
                    json( obj ) {
                        should.exist( obj );
                        obj.should.be.an("object");
                        obj.should.have.all.keys("monitoring");
                        obj.monitoring.should.equal(true);
                        done();
                    }
                };

            breweriesController.isMonitoring({}, res);
        });
    });

    describe("#stopMonitoring()", function() {
        it("should stop monitoring when hit for the first time and should stop daemon", function( done ) {
            let
                daemonStopped = false;

            const
                res = {
                    send( statusText ) {
                        should.exist( statusText );
                        statusText.should.be.an("string");
                        statusText.should.equal("STOPPED");
                        daemonStopped.should.equal(true);
                        done();
                    }
                };

            monitorTemperatureDaemonMock.stop = () => {
                daemonStopped = true;
            };

            breweriesController.stopMonitoring({}, res);
        });

        it("if clicked again then daemon should not be stopped again and UI should be notified", function(done) {
            const
                res = {
                    send( statusText ) {
                        should.exist( statusText );
                        statusText.should.be.an("string");
                        statusText.should.equal("NOT_MONITORING");
                        done();
                    }
                };

            breweriesController.stopMonitoring({}, res);
        });
    });

    describe("#isMonitoring()", function() {
        it(`should respond monitoring as false`, function(done) {
            const
                res = {
                    json( obj ) {
                        should.exist( obj );
                        obj.should.be.an("object");
                        obj.should.have.all.keys("monitoring");
                        obj.monitoring.should.equal(false);
                        done();
                    }
                };

            breweriesController.isMonitoring({}, res);
        });
    });
});