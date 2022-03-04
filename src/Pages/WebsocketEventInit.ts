import IWebSocketEvent from "../Interfaces/IWebsocketEvent";
import { GETMessage } from "../NSLib/APIEvents";
import NCWebsocket from "../NSLib/NCWebsocket";

export default function WebsocketInit(Websocket: NCWebsocket) {
    Websocket.CreateEvent(-1, () => console.log("<Beat>"));
    Websocket.CreateEvent(0, OnNewMessage);
    Websocket.CreateEvent(1, OnDeleteMessage);
    Websocket.CreateEvent(2, OnMessageEdit);
    Websocket.CreateEvent(3, OnCreateChannel);
    Websocket.CreateEvent(4, OnDeleteChannel);
}

async function OnNewMessage(event: IWebSocketEvent) {
    const message = await GETMessage(event.Channel, event.Message);
    if (message === undefined) return;
    // TODO Implement message creation logic
}

async function OnDeleteMessage(event: IWebSocketEvent) {
    // TODO Implement message removal logic
}

async function OnMessageEdit(event: IWebSocketEvent) {
    // TODO Implement message edit logic
}

async function OnCreateChannel(event: IWebSocketEvent) {
    // TODO Implement channel creation logic
}

async function OnDeleteChannel(event: IWebSocketEvent) {
    // TODO Implement channel removal logic
}