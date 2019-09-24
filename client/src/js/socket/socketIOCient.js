import SocketIoClient from "socket.io-client";
import {temperatureChange} from "../../../../common/socketEvents";

let
    socket;

function subscribeToTemperatureChanges( callback ) {
    socket = SocketIoClient();

    socket.on( temperatureChange.eventName, (beersArr) => {
        callback(beersArr);
    } );
}

function unsubscribeToTemperatureChanges() {
    socket && socket.close();
    socket = null;
}

function isAlreadySubscribed() {
    return socket && true;
}

export {
    subscribeToTemperatureChanges,
    unsubscribeToTemperatureChanges,
    isAlreadySubscribed
};