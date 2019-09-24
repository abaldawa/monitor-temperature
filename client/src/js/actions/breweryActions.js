
import {ERROR_OCCURRED, CLEAR_ERROR, IS_MONITORING, FETCHED_BREWERIES, IS_LOADING} from '../constants/action-types';
import {GET_BREWERIES_URL, START_MONITORING_URL, STOP_MONITORING_URL} from '../endpoints/breweriesEndpoints';

const
    loadingData = isLoading => ({type: IS_LOADING, payload: isLoading}),
    showError = errMsg => ({type: ERROR_OCCURRED, payload: errMsg}),
    clearError = () => ({type: CLEAR_ERROR}),
    isMonitoring = bool => ({type: IS_MONITORING, payload: bool}),
    addBreweries = beersArr => ({type: FETCHED_BREWERIES, payload: beersArr});

async function fetchBreweries( dispatch ) {
    try{
        dispatch( loadingData(true) );

        const
            response = await fetch(GET_BREWERIES_URL),
            breweriesJson = await response.json();

        dispatch( isMonitoring(breweriesJson.monitoring) );
        dispatch( addBreweries(breweriesJson.beers) );
        dispatch( loadingData(false) );
    } catch( err ) {
        dispatch(loadingData(false));
        dispatch(showError(`Error loading breweries. Reason: ${err}`));
    }
}

async function startMonitoring( dispatch ) {
    try{
        dispatch( loadingData(true) );

        const response = await fetch( START_MONITORING_URL, {method: "POST"} );

        if( response.status !== 200 ) {
            throw new Error(`Invalid status code = ${response.status} received from the server`);
        }

        dispatch(isMonitoring(true));
        dispatch(loadingData(false));
    } catch( err ) {
        dispatch(loadingData(false));
        dispatch(showError(`Error monitoring breweries temperature. Reason: ${err}`));
        return false;
    }

    return true;
}

async function stopMonitoring( dispatch ) {
    try{
        dispatch( loadingData(true) );

        const response = await fetch( STOP_MONITORING_URL, {method: "POST"} );

        if( response.status !== 200 ) {
            throw new Error(`Invalid status code = ${response.status} received from the server`);
        }

        dispatch( isMonitoring(false) );
        dispatch(loadingData(false));
    } catch( err ) {
        dispatch(loadingData(false));
        dispatch(showError(`Error stopping to monitor. Reason: ${err}`));
        return false;
    }

    return true;
}

function latestBeersStatus( dispatch, beers ) {
    dispatch( addBreweries(beers) );
}

function clearErrorMessage( dispatch ) {
    dispatch( clearError() );
}

export {
    fetchBreweries,
    clearErrorMessage,
    startMonitoring,
    stopMonitoring,
    latestBeersStatus
}