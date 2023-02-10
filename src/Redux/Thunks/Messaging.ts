import { addAttachment, addMultipleAttachments, addMultipleMessages, clearAttachments, removeAttachmentByID } from "Redux/Slices/ChatSlice";
import { selectChannel, selectChannelUUIDByUUID } from "Redux/Selectors/ChannelSelectors";

import { AppAsyncThunkConfig, AppThunk } from "Redux/Store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { startDoingSomething, stopDoingSomething } from "Redux/Slices/AppSlice";

import { RequestDeleteMessage, RequestEditMessage, RequestMessages, SendMessage } from "Lib/API/Endpoints/Messages";
import { FetchImageFromClipboard, NCFile, UploadFile } from "Lib/ElectronAPI";

import type { MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";
import type { IMessageProps } from "Types/API/Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import MessageAttachment from "Types/API/MessageAttachment";
import { createAppAsyncThunk } from "Redux/Hooks";

export function MessagesPopulate(channelUUID?: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    const filteredChannelUUID = selectChannelUUIDByUUID(channelUUID)(getState());
    const messages = state.chat.channelMessageMap[filteredChannelUUID];
    let oldestID = 1;
    dispatch(startDoingSomething());

    if (messages !== undefined) {
      oldestID = parseInt(messages[messages.length - 1].message_Id);
    }

    RequestMessages(filteredChannelUUID, (messages: IMessageProps[]) => {
      dispatch(addMultipleMessages(messages, filteredChannelUUID));
      dispatch(stopDoingSomething());
    }, false, 30, -1, oldestID - 1);
  }
}

export function MessageInputSubmit(event: MessageInputSendEvent): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    const selectedChannel = state.chat.selectedChannel;
    const attachments = state.chat.attachments;

    if (selectedChannel === undefined || event.value === undefined || (event.value === "" && attachments.length === 0)) return;

    SendMessage(selectedChannel.table_Id, event.value, attachments, (sent: boolean) => {
      if (sent) {
        dispatch(clearAttachments());
      }
    });
  }
}

export const MessageEdit = createAppAsyncThunk<Promise<void>, MessageProps>("message/edit", async (message, thunkAPI) => {
  if (message.id === undefined) return;
  const currentChannel = selectChannel()(thunkAPI.getState());
  if (!currentChannel) return;
  console.log(`Request to edit message ${message.id}`);
  if (await RequestEditMessage(currentChannel.table_Id, message.id, message.content || "")) {
    console.success(`Request to edit message ${message.id} successful`);
  }
});

export const MessageDelete = createAppAsyncThunk<Promise<void>, MessageProps>("message/edit", async (message, thunkAPI) => {
  if (message.id === undefined) return;
  const currentChannel = selectChannel()(thunkAPI.getState());
  if (!currentChannel) return;
  console.log(`Request to delete message ${message.id}`);
  if (await RequestDeleteMessage(currentChannel.table_Id, message.id as string)) {
    console.success(`Request to delete message ${message.id} successful`);
  }
});

export function MessageFileUpload(clipboard?: boolean, event?: React.ClipboardEvent<HTMLInputElement>): AppThunk {
  return (dispatch, getState) => {
    if (clipboard) {
      FetchImageFromClipboard(event).then(async (value: NCFile | string) => {
        if (typeof value === "string") return;
        dispatch(addAttachment(new MessageAttachment(value.FileContents, value.Filename)));
      });
      return;
    }
    UploadFile(true).then((files: string | any[]) => {
      const newAttachmentList: MessageAttachment[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        newAttachmentList.push(new MessageAttachment(file.FileContents, file.Filename));
      }

      dispatch(addMultipleAttachments(newAttachmentList));
    });
  }
};

export function MessageFileRemove(id?: string): AppThunk {
  return (dispatch, getState) => {
    if (!id) {
      dispatch(clearAttachments());
      return;
    }

    dispatch(removeAttachmentByID(id));
  }
};
