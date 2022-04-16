import NCEvents from "NSLib/NCEvents";
import { SettingsManager } from "NSLib/SettingsManager";
import IWebSocketEvent from "../Interfaces/IWebsocketEvent";
import { GETKey, GETKeystore, GETMessage } from "../NSLib/APIEvents";
import NCWebsocket from "../NSLib/NCWebsocket";

const Manager = new SettingsManager();
export const Events = new NCEvents();
export default function WebsocketInit(Websocket: NCWebsocket) {
  Websocket.CreateEvent(-1, () => console.log("<Beat>"));

  // Message
  Websocket.CreateEvent(0, OnNewMessage);
  Websocket.CreateEvent(1, OnDeleteMessage);
  Websocket.CreateEvent(2, OnMessageEdit);

  // Channel
  Websocket.CreateEvent(3, OnCreateChannel);
  Websocket.CreateEvent(4, OnDeleteChannel);

  // Keystore
  Websocket.CreateEvent(7, OnAddNewKey);
  Websocket.CreateEvent(8, OnRemoveKey);
  Websocket.CreateEvent(9, OnKeystoreReload);
}

async function OnNewMessage(event: IWebSocketEvent) {
  const message = await GETMessage(event.Channel, event.Message);
  if (message === undefined) return;
  // TODO Implement message creation logic
  Events.send("NewMessage", message);
}

async function OnDeleteMessage(event: IWebSocketEvent) {
  // TODO Implement message removal logic
  Events.send("DeleteMessage", event.Message);
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

async function OnAddNewKey(event: IWebSocketEvent) {
    const key = await GETKey(Manager.User.uuid, event.keyUserUUID);
    if (key === undefined) return;
    Manager.WriteKey(event.keyUserUUID, key);
}

async function OnRemoveKey(event: IWebSocketEvent) {
    Manager.ClearKey(event.keyUserUUID);
}

async function OnKeystoreReload(event: IWebSocketEvent) {
    const keystore = await GETKeystore(Manager.User.uuid);
    if (keystore === undefined) return;
    await Manager.ClearKeys();
    Manager.LoadKeys(keystore);
}
