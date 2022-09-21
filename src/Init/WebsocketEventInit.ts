import { NotificationType, TriggerNotification } from "NSLib/ElectronAPI";
import { NCChannelCache } from "NSLib/NCChannelCache";
import NCEvents from "NSLib/NCEvents";
import { SettingsManager } from "NSLib/SettingsManager";
import { UserCache } from "Views/MainView/MainView";
import IWebSocketEvent from "Types/API/Interfaces/IWebsocketEvent";
import { GETChannel, GETFriendState, GETKey, GETKeystore, GETMessage, GETUser } from "../NSLib/APIEvents";
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

  // Username
  Websocket.CreateEvent(10, OnUsernameChanged);

  // Friends
  Websocket.CreateEvent(11, FriendRequestAdded);
  Websocket.CreateEvent(12, FriendRequestUpdated);
  Websocket.CreateEvent(13, FriendRequestRemoved)
}

async function OnNewMessage(event: IWebSocketEvent) {
  const message = await GETMessage(event.Channel, event.Message, true);
  if (message === undefined) return;
  Events.send("NewMessage", message, event.Channel);
  // Trigger notification
  if (new SettingsManager().User.uuid !== message.author_UUID)
    TriggerNotification(`New Message from ${(await UserCache.GetUserAsync(message.author_UUID)).username}`, message.content, NotificationType.Info, `User/${message.author_UUID}/Avatar?size=64`);
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

async function OnUsernameChanged(event: IWebSocketEvent) {
  const user = await GETUser(event.User);
  if (user === undefined) return;
  UserCache.AddUser(user);
}

async function FriendRequestAdded(event: IWebSocketEvent) {
  console.log("New request");
  // Trigger notification
  if (new SettingsManager().User.uuid !== event.User)
    TriggerNotification("New Friend Request", `${(await UserCache.GetUserAsync(event.User)).username} has requested to be your friend`, NotificationType.Info, `User/${event.User}/Avatar?size=64`);
  Events.send("FriendAdded", event.User, await GETFriendState(event.User));
}

async function FriendRequestUpdated(event: IWebSocketEvent) {
  console.log("Friend Updated")
  Events.send("FriendUpdated", event.User, await GETFriendState(event.User));
}

async function FriendRequestRemoved(event: IWebSocketEvent) {
  console.log("Friend Removed");
  Events.send("FriendRemoved", event.User);
}
