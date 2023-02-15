import { RequestDeleteChannel, RequestChannel, RequestRemoveMember, RequestUpdateChannelIcon, RequestUpdateChannelName, RequestResetChannelIcon, RequestAddMember } from "Lib/API/Endpoints/Channels";
import { RequestFriendState, SendFriendRequest } from "Lib/API/Endpoints/Friends";
import { RequestMessages } from "Lib/API/Endpoints/Messages";
import { RequestUser, RequestUserChannels, RequestUserUUID } from "Lib/API/Endpoints/User";
import { ChannelCache } from "Lib/Storage/Objects/ChannelCache";
import { HasUrlFlag, Flags } from "Lib/Debug/Flags";
import NSPerformance from "Lib/Debug/NSPerformance";
import UserData from "Lib/Storage/Objects/UserData";

import { AppThunk } from "Redux/Store";
import { navigate } from "Redux/Thunks/Routing";
import { startDoingSomething, stopDoingSomething } from "Redux/Slices/AppSlice";
import { clearMessagesByID, setAllMessagesAtOnce, setActiveChannel, setAllChannelsAtOnce } from "Redux/Slices/ChatSlice";
import { selectParamByKey } from "Redux/Selectors/RoutingSelectors";
import { selectChannel } from "Redux/Selectors/ChannelSelectors";

import { ChannelTypes, RecipientFormErrorState } from "Types/Enums";
import type { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import type { IMessageProps } from "Types/API/Interfaces/IMessageProps";
import type { IChannelUpdateProps } from "Types/API/Interfaces/IChannelUpdateProps";
import type IUserData from "Types/API/Interfaces/IUserData";
import { Routes } from "Types/UI/Routing";
import { INotSoRawChannelProps } from "Types/API/Interfaces/INotSoRawChannelProps";
import Friend from "Types/UI/Friend";
import { IsValidUsername } from "Lib/Utility/Utility";

export function channelContainsUUID(uuid: string, noGroup?: boolean): AppThunk<IRawChannelProps | undefined> {
  return (dispatch, getState) => {
    const state = getState();
    const channels = state.chat.channels;

    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];

      if (noGroup && (channel.channelType !== ChannelTypes.DMChannel)) continue;

      const containsUUID = (() => {
        if (channel.members) {
          for (let j = 0; j < channel.members.length; j++) {
            if (channel.members[j] === uuid) return true;
          }
          return false;
        }
        return false;
      })()

      if (containsUUID) return channel;
    }

    return undefined;
  }
}

export function ChannelsPopulate(preload?: boolean): AppThunk {
  return (dispatch, getState) => {
    RequestUserChannels(async (channels: string[]) => {
      let state = getState();
      const perf = new NSPerformance("LoadChannelList");
      const loadedChannels = [] as INotSoRawChannelProps[];
      const loadedFriends = [] as Friend[];
      const avatarNonce = state.app.session;

      for (var i = 0; i < channels.length; i++) {
        const perfC = new NSPerformance("GETChannelInfo")
        const channel: INotSoRawChannelProps | undefined = await RequestChannel(channels[i]);
        if (channel === undefined) continue;
        channel.ui = { members: [] };
        if (channel.members) {
          for (let i = 0; i < channel.members.length; i++) {
            const member = channel.members[i];
            let memberData = loadedFriends.find(friend => friend.friendData?.uuid === member);
            if (!memberData) {
              const newMemberData = await RequestUser(member);
              const memberStatus = await RequestFriendState(member);
              memberData = { friendData: newMemberData, status: memberStatus };
              loadedFriends.push(memberData);
            }

            const isOwner = member === channel.owner_UUID;
            const removable = isOwner && member !== UserData.Uuid;
            if (channel.ui && channel.ui.members) channel.ui.members.push({ ...memberData, uiStates: { isOwner: isOwner, removable: removable } });
          }
        }
        channel.channelIcon = `${channel.channelIcon}&nonce=${avatarNonce}`;
        loadedChannels.push(channel);
        perfC.Stop();
      }

      const perfDispatch = new NSPerformance("ChannelDispatch");
      dispatch(setAllChannelsAtOnce(loadedChannels));
      perfDispatch.Stop();
      perf.Stop();

      if (preload) {
        state = getState();
        const channelUUID = selectParamByKey("channel")(state);
        const preChannel = selectChannel(channelUUID?.value)(state);
        if (preChannel) dispatch(ChannelLoad(preChannel));
      }
    });
  }
}

export function ChannelLoad(channel?: IRawChannelProps): AppThunk {
  return async (dispatch, getState) => {
  const state = getState();
  const session = state.app.session;

  if (!channel && state.chat.selectedChannel) channel = state.chat.selectedChannel;
  if (!channel && state.chat.channels.length > 0) channel = state.chat.channels[0];
  if (channel === undefined || channel.table_Id === undefined) return;

  dispatch(navigate({ pathname: Routes.Chat, params: [ { key: "channel", value: channel.table_Id } ], title: channel.channelName }));
  dispatch(setActiveChannel(channel));
  dispatch(clearMessagesByID(channel.table_Id));
  dispatch(startDoingSomething());

  // Check if channel has cache
  const isCache = await ChannelCache.ContainsCache(channel.table_Id);

  if (isCache !== undefined && !await (isCache as ChannelCache).IsEmpty()) {
    const cache = isCache as ChannelCache;
    // Fully refresh cache, ignoring anything, pulling the newest messages
    if (await cache.RequiresRefresh() || HasUrlFlag(Flags.ForceCacheRebuild)) {
      console.log("Rebuilding cache...");
      //cache.ClearCache();

      RequestMessages(channel.table_Id, async (messages: IMessageProps[]) => {
        if (channel === undefined || channel.table_Id === undefined) return; // To suppress the compiler error because the linter is dumb (or I did something dumb)
        dispatch(setAllMessagesAtOnce([...messages], channel.table_Id));
        //scrollCanvas();
        dispatch(stopDoingSomething());
      }, true);

      await cache.WriteSession(session);
      return true;
    }

    if (!await cache.IsValidSession(session) || HasUrlFlag(Flags.IgnoreCacheSession)) {
      console.log("Checking and updating cache...");
      //await NCChannelCache.CleanCache(channel.table_Id);
      //await NCChannelCache.UpdateCache(channel.table_Id);

      const c = await ChannelCache.Open(channel.table_Id)
      await c.WriteSession(session);

      RequestMessages(channel.table_Id, (messages: IMessageProps[]) => {
        if (channel === undefined || channel.table_Id === undefined) return; // To suppress the compiler error because the linter is dumb (or I did something dumb)
        dispatch(setAllMessagesAtOnce([...messages], channel.table_Id));
        dispatch(stopDoingSomething());
        //scrollCanvas();
      }, true);

      return true;
    }

    RequestMessages(channel.table_Id, (messages: IMessageProps[]) => {
      if (channel === undefined || channel.table_Id === undefined) return; // To suppress the compiler error because the linter is dumb (or I did something dumb)
      dispatch(setAllMessagesAtOnce([...messages], channel.table_Id));
      dispatch(stopDoingSomething());
      //scrollCanvas();
    });
  }
  else {
    RequestMessages(channel.table_Id, async (messages: IMessageProps[]) => {
      if (channel === undefined || channel.table_Id === undefined) return; // To suppress the compiler error because the linter is dumb (or I did something dumb)
      dispatch(setAllMessagesAtOnce([...messages], channel.table_Id));
      //scrollCanvas();
      const cc = await ChannelCache.ContainsCache(channel.table_Id);
      if (cc) await (cc as ChannelCache).WriteSession(session);
      dispatch(stopDoingSomething());
    }, true);
  }

  return true;
  }
}

export async function ChannelAddRecipient(channel_uuid:string, recipient: string) {
  if (IsValidUsername(recipient)) {
    const ud = recipient.split("#");
    const user = await RequestUserUUID(ud[0], ud[1]);
    if (user === undefined) return RecipientFormErrorState.UserNotFound;
    RequestAddMember(channel_uuid, [user], () => {});
    return RecipientFormErrorState.Success;
  }
  return RecipientFormErrorState.InvalidFormat;
};

export function ChannelClearCache(channel: IRawChannelProps) {
  console.log(`Request to clear channel ${channel.channelName}'s cache`);
  if (channel.table_Id === undefined) return;
  ChannelCache.DeleteSpecificCache(channel.table_Id).then((success: boolean) => {
    if (!success) console.error(`Failed to clear channel ${channel.table_Id}'s cache`)
    console.success(`Cleared channel ${channel.channelName}'s cache successfully`);
  });
};

export function ChannelEdit(channel: IChannelUpdateProps) {
  console.log(`Request to edit channel ${channel.table_Id}`);
  RequestUpdateChannelName(channel.table_Id, channel.channelName, (result) => { if (result) console.success(`Successfully changed channel ${channel.table_Id}'s name to ${channel.channelName}`); else console.error(`Failed to change channel ${channel.table_Id}'s channel name`) });
  if (channel.channelIcon && channel.channelIcon.FileContents) RequestUpdateChannelIcon(channel.table_Id, new Blob([channel.channelIcon.FileContents]), (result) => { if (result) console.success(`Successfully changed channel ${channel.table_Id}'s icon`); else console.error(`Failed to change channel ${channel.table_Id}'s channel icon`) });
  //loadChannels();
  //onAvatarChanged();
};

export function ChannelDelete(channel: IRawChannelProps) {
  console.log(`Request to delete channel ${channel.channelName}`);
  if (channel.table_Id === undefined) return;
  RequestDeleteChannel(channel.table_Id, (deleted: boolean) => {
    console.success(`Request to delete channel ${channel.channelName} successful`);
  });
};

export function ChannelMove(currentChannel: IRawChannelProps, otherChannel: IRawChannelProps, index: number) {
  console.log(`Request to move channel ${otherChannel.channelName} to new index of ${index}`);
  console.warn("Moving channels isn't actually implemented yet");
  // TODO: Add Channel move logic here
};

export function ChannelRemoveRecipient(channel: IRawChannelProps, recipient: IUserData) {
  RequestRemoveMember(channel.table_Id, recipient.uuid, (removed) => {
    if (removed) console.success(`Successfully removed user ${recipient.username} from the channel ${channel.channelName}`)
    else console.error(`Unable to remove user ${recipient.username} from the channel ${channel.channelName}`);
  });
}

export function ChannelResetIcon(channel: IRawChannelProps) {
  RequestResetChannelIcon(channel.table_Id, (result) => { if (result) console.success(`Successfully reset channel ${channel.table_Id}'s icon`); else console.error(`Failed to reset channel ${channel.table_Id}'s channel icon`) });
}
