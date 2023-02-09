import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { IMessageProps } from "Types/API/Interfaces/IMessageProps";
import type { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import type MessageAttachment from "Types/API/MessageAttachment";

export interface ChatSliceState {
  selectedChannel?: IRawChannelProps,
  channelMessageMap: {
    [channelUUID: string] : IMessageProps[]
  },
  channels: IRawChannelProps[],
  attachments: MessageAttachment[]
}

const initialState: ChatSliceState = {
  selectedChannel: undefined,
  channelMessageMap: {},
  channels: [],
  attachments: []
}

export const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: {
      reducer (state, action: PayloadAction<{ newMessage: IMessageProps, channelUUID: string }>) {
        let { newMessage, channelUUID } = action.payload;

        if (state.channelMessageMap[channelUUID] !== undefined) {
          let messages = state.channelMessageMap[channelUUID];

          if (messages.findIndex(message => message.message_Id === newMessage.message_Id) > -1) return;

          messages = [newMessage, ...messages];

          state.channelMessageMap[channelUUID] = messages;
        }
        else {
          state.channelMessageMap[channelUUID] = [newMessage];
        }
      },
      prepare (newMessage: IMessageProps, channelUUID: string) {
        return {
          payload: {
            newMessage, channelUUID
          }
        }
      }
    },
    addMultipleMessages: {
      reducer (state, action: PayloadAction<{ newMessages: IMessageProps[], channelUUID: string }>) {
        let { newMessages, channelUUID } = action.payload;

        if (state.channelMessageMap[channelUUID] !== undefined) {
          let messages = state.channelMessageMap[channelUUID];

          for (let i = 0; i < newMessages.length; i++) {
            const newMessage = newMessages[i];

            if (messages.findIndex(message => message.message_Id === newMessage.message_Id) > -1) continue;

            state.channelMessageMap[channelUUID].push(newMessage);
          }
        }
        else {
          state.channelMessageMap[channelUUID] = newMessages;
        }
      },
      prepare (newMessages: IMessageProps[], channelUUID: string) {
        return {
          payload: {
            newMessages, channelUUID
          }
        }
      }
    },
    editMessage: {
      reducer (state, action: PayloadAction<{ editedMessage: IMessageProps, channelUUID: string }>) {
        let { editedMessage, channelUUID } = action.payload;

        if (state.channelMessageMap[channelUUID] !== undefined) {
          const messages = state.channelMessageMap[channelUUID];
          const target = messages.findIndex((value) => value.message_Id === editedMessage.message_Id);

          if (target > -1) {
            messages[target] = editedMessage;
          }

          state.channelMessageMap[channelUUID] = messages;
        }
      },
      prepare (editedMessage: IMessageProps, channelUUID: string) {
        return {
          payload: {
            editedMessage, channelUUID
          }
        }
      }
    },
    removeMessageByIndex: {
      reducer (state, action: PayloadAction<{ index?: number, channelUUID: string }>) {
        let { index, channelUUID } = action.payload;

        if (index !== undefined) {
          if (state.channelMessageMap[channelUUID] !== undefined) {

            const messages = state.channelMessageMap[channelUUID];

            if (index !== undefined && index < messages.length) {
              messages.splice(index, 1);
            }
            else {
              messages.pop();
            }

            state.channelMessageMap[channelUUID] = messages;
          }
        }
      },
      prepare (index: number, channelUUID: string) {
        return {
          payload: {
            index, channelUUID
          }
        }
      }
    },
    removeMessageByID: {
      reducer (state, action: PayloadAction<{ id: string, channelUUID: string }>) {
        let { id, channelUUID } = action.payload;

        if (state.channelMessageMap[channelUUID] !== undefined) {
          const messages = state.channelMessageMap[channelUUID];
          const target = messages.findIndex((value) => id === value.message_Id);

        if (target > -1) {
          messages.splice(target, 1);
          state.channelMessageMap[channelUUID] = messages;
        }
        }
      },
      prepare (id: string, channelUUID: string) {
        return {
          payload: {
            id, channelUUID
          }
        }
      }
    },
    setAllMessagesAtOnce: {
      reducer (state, action: PayloadAction<{ newMessages: IMessageProps[], channelUUID: string }>) {
        let { newMessages, channelUUID } = action.payload;

        state.channelMessageMap[channelUUID] = newMessages;
      },
      prepare (newMessages: IMessageProps[], channelUUID: string) {
        return {
          payload: {
            newMessages, channelUUID
          }
        }
      }
    },
    addChannel: (state, action: PayloadAction<IRawChannelProps>) => {
      const channelIndex = state.channels.findIndex(c => c.table_Id === action.payload.table_Id);
      if (channelIndex > -1) {
        state.channels[channelIndex] = action.payload;
        return;
      }
      state.channels.push(action.payload);
    },
    setAllChannelsAtOnce: (state, action: PayloadAction<IRawChannelProps[]>) => {
      state.channels = action.payload;
    },
    removeChannelByID: (state, action: PayloadAction<string>) => {
      const channels = state.channels;
      const target = channels.findIndex((value) => value.table_Id === action.payload);

      if (target > -1) {
        channels.splice(target, 1);
        state.channels = channels;
      }
    },
    setActiveChannel: (state, action: PayloadAction<IRawChannelProps>) => {
      state.selectedChannel = action.payload;
    },
    setActiveChannelByID: (state, action: PayloadAction<string>) => {
      const channelUUID = action.payload;
      const target = state.channels.find((channel) => channel.table_Id === channelUUID);

      if (target !== undefined) {
        state.selectedChannel = target;
      }
    },
    clearChannels: (state) => {
      state.channels = [];
    },
    addAttachment: (state, action: PayloadAction<MessageAttachment>) => {
      state.attachments.push(action.payload);
    },
    addMultipleAttachments: (state, action: PayloadAction<MessageAttachment[]>) => {
      state.attachments = [...state.attachments, ...action.payload]
    },
    setAllAttachmentsAtOnce: (state, action: PayloadAction<MessageAttachment[]>) => {
      state.attachments = action.payload;
    },
    removeAttachmentByID: (state, action: PayloadAction<string>) => {
      const index = state.attachments.findIndex((attachment) => attachment.id === action.payload);

      if (index > -1) {
        state.attachments.splice(index, 1);
      }
    },
    removeAttachmentByIndex: (state, action: PayloadAction<number | undefined>) => {
      if (action.payload !== undefined && action.payload < state.attachments.length) {
        state.attachments.splice(action.payload, 1);
      }
      else {
        state.attachments.pop();
      }
    },
    clearAttachments: (state) => {
      state.attachments = [];
    },
    clearMessagesByID: (state, action: PayloadAction<string>) => {
      if (state.channelMessageMap[action.payload] !== undefined) {
        delete state.channelMessageMap[action.payload];
      }
    },
    clearEntireMessageMap: (state) => {
      state.channelMessageMap = {};
    },
  }
});

export const { addMessage, addMultipleMessages, addAttachment, addMultipleAttachments, setAllAttachmentsAtOnce, removeAttachmentByIndex, removeAttachmentByID, editMessage, removeMessageByIndex, removeMessageByID, setAllMessagesAtOnce, addChannel, setAllChannelsAtOnce, removeChannelByID, setActiveChannel, setActiveChannelByID, clearChannels, clearAttachments, clearMessagesByID, clearEntireMessageMap } = ChatSlice.actions;
export default ChatSlice.reducer;
