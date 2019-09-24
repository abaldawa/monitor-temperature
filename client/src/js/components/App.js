import React, {useContext, useEffect} from "react";
import DataTable from './table/DataTable';
import {ApplicationContext} from "../store";
import {fetchBreweries, startMonitoring, stopMonitoring, latestBeersStatus} from "../actions/breweryActions";
import {subscribeToTemperatureChanges, unsubscribeToTemperatureChanges, isAlreadySubscribed} from "../socket/socketIOCient";

function App() {
    const
        { state = {}, dispatch } = useContext(ApplicationContext),
        {monitoring, beers = [], isLoading} = state,
        headings = ["#", "Brewery", "Temperature Range", "Current Temperature"],
        rows = beers.map( (beerObj, index) => {
                    return {
                        [headings[0]]: index + 1,
                        [headings[1]]: beerObj.name,
                        [headings[2]]: `${beerObj.minimumTemperature}-${beerObj.maximumTemperature}${beerObj.unit}`,
                        [headings[3]]: beerObj.currentTemperature || "",
                        safe: beerObj.safe
                    };
               } ),
        statusMsg = monitoring ? "Currently monitoring beer temperatures after every 10 seconds" : "Not monitoring. press 'Start' button to monitor beer temperatures";

    function handleStartMonitoring() {
        startMonitoring( dispatch );
    }

    async function handleStopMonitoring() {
        const isStopped = await stopMonitoring( dispatch );

        if( isStopped ) {
            unsubscribeToTemperatureChanges();
        }
    }

    useEffect(() => {
        if( !beers.length ) {
            fetchBreweries( dispatch );
        }

        return () => {
            unsubscribeToTemperatureChanges();
        }
    }, []);

    if( monitoring && !isAlreadySubscribed() ) {
        subscribeToTemperatureChanges( beersArr => {
            latestBeersStatus( dispatch, beersArr )
        });
    }

    return (
        <>
            <div className={`informationText ${monitoring ? "isMonitoring": ""}`}>
                {statusMsg}
            </div>
            <DataTable headings={headings} rows={rows}/>
            <div className="buttonHolder">
                <button
                    className={`button startButton ${(monitoring || isLoading) ? "disabledButton": ""}`}
                    disabled={monitoring || isLoading}
                    onClick={handleStartMonitoring}>
                    Start
                </button>
                <button
                    className={`button stopButton ${(!monitoring || isLoading) ? "disabledButton": ""}`}
                    disabled={!monitoring}
                    onClick={handleStopMonitoring}>
                    Stop
                </button>
            </div>
        </>
    );
}

export default App;