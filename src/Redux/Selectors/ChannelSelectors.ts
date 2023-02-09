import { AppSelector } from "Redux/Store";
import type { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";

export function selectChannel(channelUUID?: string): AppSelector<IRawChannelProps | undefined> {
  return (state) => {
    if (!channelUUID) {
      if (state.chat.selectedChannel) return state.chat.selectedChannel;
      if (state.chat.channels.length > 0) return state.chat.channels[0];
      return;
    }

    return state.chat.channels.find(c => c.table_Id === channelUUID);
  }
}

export function selectChannelUUIDByUUID(channelUUID?: string): AppSelector<string> {
  return (state) => {
    if (channelUUID !== undefined) return channelUUID;

    const selectedChannel = state.chat.selectedChannel;

    if (selectedChannel !== undefined && selectedChannel.table_Id !== undefined) return selectedChannel.table_Id;

    console.warn("selectChannelUUIDByUUID was called with no UUID, and the selected channel is undefined. Thus an empty string will be returned."); // Technically not "pure", but this is a selector, so eh

    return "";
  }
}
