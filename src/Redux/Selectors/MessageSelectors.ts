import { AppSelector } from "Redux/Store";
import { IMessageProps } from "Types/API/Interfaces/IMessageProps";


export function selectMessagesByChannel(channelUUID?: string): AppSelector<IMessageProps[] | undefined> {
  return (state) => {
    if (channelUUID !== undefined && state.chat.channelMessageMap[channelUUID] !== undefined) {
      return state.chat.channelMessageMap[channelUUID];
    }

    if (state.chat.selectedChannel !== undefined) {
      const currentChannel = state.chat.selectedChannel;

      if (state.chat.channelMessageMap[currentChannel.table_Id] !== undefined) {
        return state.chat.channelMessageMap[currentChannel.table_Id];
      }
    }
}
}
