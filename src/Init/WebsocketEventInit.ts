// Source
import { uCache } from "App";
import { RequestChannel } from "Lib/API/Endpoints/Channels";
import { RequestFriendState } from "Lib/API/Endpoints/Friends";
import { RequestKey, RequestUserKeystore } from "Lib/API/Endpoints/Keystore";
import { RequestMessage } from "Lib/API/Endpoints/Messages";
import { RequestUser } from "Lib/API/Endpoints/User";
import Events from "Lib/API/Events";
import NCWebsocket from "Lib/API/NCWebsocket";
import { NotificationType, TriggerNotification } from "Lib/ElectronAPI";
import { ChannelCache } from "Lib/Storage/Objects/ChannelCache";
import KeyStore from "Lib/Storage/Objects/KeyStore";
import UserData from "Lib/Storage/Objects/UserData";

// Types
import IWebSocketEvent from "OldTypes/API/Interfaces/IWebsocketEvent";

export const events = new Events();
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

  // Username
  Websocket.CreateEvent(10, OnUsernameChanged);

  // Friends
  Websocket.CreateEvent(11, FriendRequestAdded);
  Websocket.CreateEvent(12, FriendRequestUpdated);
  Websocket.CreateEvent(13, FriendRequestRemoved)
}

async function OnNewMessage(event: IWebSocketEvent) {
  const message = await RequestMessage(event.Channel, event.Message, true);
  if (message === undefined) return;
  events.send("NewMessage", message, event.Channel);
  // Trigger notification
  if (UserData.Uuid !== message.author_UUID)
    TriggerNotification(`New Message from ${(await uCache.GetUserAsync(message.author_UUID)).username}`, message.content, NotificationType.Info, `User/${message.author_UUID}/Avatar?size=64`);
  // Add message to cache
  (await ChannelCache.Open(event.Channel)).SetMessage(event.Message, message);
}

async function OnDeleteMessage(event: IWebSocketEvent) {
  events.send("DeleteMessage", event.Message);
  // Clear message from cache
  (await ChannelCache.Open(event.Channel)).RemoveMessage(event.Message);
}

async function OnMessageEdit(event: IWebSocketEvent) {
  const message = await RequestMessage(event.Channel, event.Message, true);
  if (message === undefined) return;
  events.send("EditMessage", message);
  // Update message in cache
  (await ChannelCache.Open(event.Channel)).SetMessage(event.Message, message);
}

async function OnCreateChannel(event: IWebSocketEvent) {
  const channel = await RequestChannel(event.Channel);
  if (channel === undefined) return;
  events.send("NewChannel", channel);
}

async function OnDeleteChannel(event: IWebSocketEvent) {
  events.send("DeleteChannel", event.Channel);
}

async function OnAddNewKey(event: IWebSocketEvent) {
  const key = await RequestKey(event.keyUserUUID);
  if (key === undefined) return;
  KeyStore.SetKey(event.keyUserUUID, key);
}

async function OnRemoveKey(event: IWebSocketEvent) {
  KeyStore.ClearKey(event.keyUserUUID);
}

async function OnKeystoreReload(event: IWebSocketEvent) {
  const keystore = await RequestUserKeystore();
  if (keystore === undefined) return;
  KeyStore.ClearKeys();
  KeyStore.LoadKeys(keystore);
}

async function OnUsernameChanged(event: IWebSocketEvent) {
  const user = await RequestUser(event.User);
  if (user === undefined) return;
  uCache.AddUser(user);
}

async function FriendRequestAdded(event: IWebSocketEvent) {
  // Trigger notification
  if (UserData.Uuid !== event.User)
    TriggerNotification("New Friend Request", `${(await uCache.GetUserAsync(event.User)).username} has requested to be your friend`, NotificationType.Info, `User/${event.User}/Avatar?size=64`);
  events.send("FriendAdded", event.User, await RequestFriendState(event.User));
}

async function FriendRequestUpdated(event: IWebSocketEvent) {
  events.send("FriendUpdated", event.User, await RequestFriendState(event.User));
}

async function FriendRequestRemoved(event: IWebSocketEvent) {
  events.send("FriendRemoved", event.User);
}
