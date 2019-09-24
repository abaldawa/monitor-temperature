/**
 * User: abhijit.baldawa
 */

const
    monitorTemperatureDaemon = require('../../../src/daemon/monitorTemperature'),
    temperatureSensorService = require('../../../src/services/temperatureSensor.service'),
    {temperatureSensorApis} = require('../../../src/services/servicesEndPoints'),
    {beers} = require('../../../src/database/sampleData/breweries');

describe("Module daemon/monitorTemperature.js", function() {
    before(function() {
        temperatureSensorService.injectDependencies({temperatureSensorApis});
    });

    describe("#monitorTemperature()", function() {
        it("should return 'currentTemperature' and whether it is 'safe' for each beer", async function(){
            const beersArr = await monitorTemperatureDaemon.monitorTemperature(beers);

            should.exist(beersArr);
            beersArr.should.be.an("array");
            beersArr.forEach( beerObj => {
                should.exist(beerObj);
                beerObj.should.be.an("object");
                beerObj.should.have.all.keys("name", "minimumTemperature", "maximumTemperature", "unit", "currentTemperature", "safe");
                beerObj.name.should.be.an("string");
                beerObj.minimumTemperature.should.be.an("number");
                beerObj.maximumTemperature.should.be.an("number");
                beerObj.unit.should.be.an("string");
                beerObj.currentTemperature.should.be.an("string");
                beerObj.safe.should.be.an("boolean");
            } );
        });
    });
});