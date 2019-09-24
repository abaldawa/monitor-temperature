import {IS_LOADING, FETCHED_BREWERIES, IS_MONITORING, ERROR_OCCURRED, CLEAR_ERROR} from '../constants/action-types';

function reducer(state, action) {
    switch (action.type) {
        case IS_LOADING:
            return {...state, isLoading: action.payload };
        case FETCHED_BREWERIES:
            return { ...state, beers: action.payload };
        case IS_MONITORING:
            return {...state, monitoring: action.payload};
        case ERROR_OCCURRED:
            return {...state, errorMessage: action.payload};
        case CLEAR_ERROR:
            return {...state, errorMessage: null};
        default:
            return state;
    }
}

export default reducer;