import React, {createContext, useReducer} from "react";
import reducer from '../reducers';

const
    Store = createContext(""),
    initialState = {
        isLoading: false,
        errorMessage: null,
        monitoring: false,
        beers: []
    };

function StoreProvider(props) {
    const
        [state, dispatch] = useReducer(reducer, initialState),
        value = { state, dispatch };

    return (
        <Store.Provider value={value}>
            {props.children}
        </Store.Provider>
    );
}

export {
    StoreProvider,
    Store as ApplicationContext
};
