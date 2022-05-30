import { NCChannelCache } from "NSLib/NCCache";
import NCEvents from "NSLib/NCEvents";
import { SettingsManager } from "NSLib/SettingsManager";
import IWebSocketEvent from "../Interfaces/IWebsocketEvent";
import { GETChannel, GETKey, GETKeystore, GETMessage } from "../NSLib/APIEvents";
import NCWebsocket from "../NSLib/NCWebsocket";

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
  const message = await GETMessage(event.Channel, event.Message, true);
  if (message === undefined) return;
  Events.send("NewMessage", message, event.Channel);
  // Add message to cache
  new NCChannelCache(event.Channel).SetMessage(event.Message, message);
}

async function OnDeleteMessage(event: IWebSocketEvent) {
  Events.send("DeleteMessage", event.Message);
  // Clear message from cache
  new NCChannelCache(event.Channel).RemoveMessage(event.Message);
}

async function OnMessageEdit(event: IWebSocketEvent) {
  const message = await GETMessage(event.Channel, event.Message, true);
  if (message === undefined) return;
  Events.send("EditMessage", message);
  // Update message in cache
  new NCChannelCache(event.Channel).SetMessage(event.Message, message);
}

async function OnCreateChannel(event: IWebSocketEvent) {
  const channel = await GETChannel(event.Channel);
  if (channel === undefined) return;
  Events.send("NewChannel", channel);
}

async function OnDeleteChannel(event: IWebSocketEvent) {
  Events.send("DeleteChannel", event.Channel);
}

async function OnAddNewKey(event: IWebSocketEvent) {
  const key = await GETKey(event.keyUserUUID);
  if (key === undefined) return;
  new SettingsManager().WriteKey(event.keyUserUUID, key);
}

async function OnRemoveKey(event: IWebSocketEvent) {
  new SettingsManager().ClearKey(event.keyUserUUID);
}

async function OnKeystoreReload(event: IWebSocketEvent) {
  const Manager = new SettingsManager();
  const keystore = await GETKeystore();
  if (keystore === undefined) return;
  await Manager.ClearKeys();
  Manager.LoadKeys(keystore);
}
