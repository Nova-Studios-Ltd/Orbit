import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SENDMessage } from "NSLib/APIEvents";
import { UploadFile } from "NSLib/ElectronAPI";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import MessageAttachment from "DataTypes/MessageAttachment";
import MessageCanvas from "Components/Messages/MessageCanvas/MessageCanvas";
import MessageCanvasHeader from "Components/Headers/MessageCanvasHeader/MessageCanvasHeader";
import MessageInput, { MessageInputChangeEvent, MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";
import ChannelList from "Components/Channels/ChannelList/ChannelList";

import type { Page } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import type { ChannelProps } from "Components/Channels/Channel/Channel";
import type { IMessageProps } from "Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";

interface ChatPageProps extends Page {
  channels?: IRawChannelProps[],
  messages?: IMessageProps[],
  selectedChannel?: IRawChannelProps,
  onChannelEdit?: (channel: ChannelProps) => void,
  onChannelDelete?: (channel: ChannelProps) => void,
  onChannelClick?: (channel: ChannelProps) => void,
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void
}

function ChatPage({ ContextMenu, channels, messages, selectedChannel, onChannelEdit, onChannelDelete, onChannelClick, onMessageEdit, onMessageDelete, changeTitleCallback }: ChatPageProps) {
  const Localizations_ChatPage = useTranslation("ChatPage").t;

  const [MessageInputValue, setMessageInputValue] = useState("");

  useEffect(() => {
    if (changeTitleCallback && selectedChannel && selectedChannel.channelName) changeTitleCallback(`@${selectedChannel.channelName}`);
  }, [changeTitleCallback, selectedChannel]);

  const MessageInputChangedHandler = (event: MessageInputChangeEvent) => {
    const value = event && event.value ? event.value : "";
    setMessageInputValue(value);
  }

  const MessageInputSendHandler = (event: MessageInputSendEvent) => {
    if (selectedChannel === undefined || event.value === undefined || event.value === "") return;
    SENDMessage(selectedChannel.table_Id, event.value, [] as MessageAttachment[], (sent: boolean) => {
      if (sent) {
        setMessageInputValue("");
      }
    });
  }

  const handleFileUpload = () => {
    UploadFile().then((file) => {
      // TODO: Implement the actual "uploading to the server" part
      console.log(file);
    });
  }

  return (
    <PageContainer noPadding>
      <div className="ChatPageContainer">
        <div className="ChatPageContainerLeft">
          <ChannelList ContextMenu={ContextMenu} channels={channels} onChannelEdit={onChannelEdit} onChannelDelete={onChannelDelete} onChannelClick={onChannelClick} selectedChannel={selectedChannel} />
        </div>
        <div className="ChatPageContainerRight">
          <MessageCanvasHeader selectedChannel={selectedChannel}></MessageCanvasHeader>
          <MessageCanvas className="ChatPageContainerItem" ContextMenu={ContextMenu} messages={messages} onMessageEdit={onMessageEdit} onMessageDelete={onMessageDelete} />
          <MessageInput className="ChatPageContainerItem" value={MessageInputValue} onFileUpload={handleFileUpload} onChange={MessageInputChangedHandler} onSend={MessageInputSendHandler} />
        </div>
      </div>
    </PageContainer>
  );
}

export default ChatPage;
