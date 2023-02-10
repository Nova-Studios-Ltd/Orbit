import { events as Events } from "Init/WebsocketEventInit";
import { uCache } from "App";

import { AppThunk } from "Redux/Store";
import { selectChannelUUIDByUUID } from "Redux/Selectors/ChannelSelectors";
import { addChannel, removeChannelByID, addMessage, editMessage, removeMessageByID } from "Redux/Slices/ChatSlice";
import { addFriend, removeFriendByValue } from "Redux/Slices/FriendSlice";

import type { IMessageProps } from "Types/API/Interfaces/IMessageProps";
import type { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";

export function RegisterWebsocketEvents(): AppThunk {
  return (dispatch, getState) => {
    Events.on("NewMessage", (message: IMessageProps, channel_uuid: string) => {
      dispatch(addMessage(message, channel_uuid));
    });

    Events.on("DeleteMessage", (messageID: string) => {
      dispatch(removeMessageByID(messageID, selectChannelUUIDByUUID()(getState())));
    });

    Events.on("EditMessage", (message: IMessageProps) => {
      dispatch(editMessage(message, selectChannelUUIDByUUID()(getState())));
    });

    Events.on("NewChannel", (channel: IRawChannelProps) => {
      dispatch(addChannel(channel));
    });

    Events.on("EditChannel", (channel: IRawChannelProps) => {
      dispatch(addChannel(channel));
    });

    Events.on("DeleteChannel", (channel: string) => {
      dispatch(removeChannelByID(channel));
    });

    Events.on("FriendAdded", async (request_uuid: string, status: string) => {
      const friendData = await uCache.GetUserAsync(request_uuid);
      dispatch(addFriend({ friendData, status }));
    });

    Events.on("FriendUpdated", async (request_uuid: string, status: string) => {
      const friendData = await uCache.GetUserAsync(request_uuid);
      dispatch(addFriend({ friendData, status }));
    });

    Events.on("FriendRemoved", async (request_uuid: string) => {
      const friendData = await uCache.GetUserAsync(request_uuid);
      dispatch(removeFriendByValue({ friendData }));
    });
  }

}

export function UnregisterWebsocketEvents() {
  Events.remove("NewMessage");
  Events.remove("DeleteMessage");
  Events.remove("EditMessage");
  Events.remove("NewChannel");
  Events.remove("DeleteChannel");
  Events.remove("FriendUpdated")
  Events.remove("FriendAdded");
  Events.remove("FriendRemoved");
}
