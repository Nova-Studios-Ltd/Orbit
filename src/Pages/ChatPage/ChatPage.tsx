import { useState } from "react";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import MessageCanvas, { MessageCanvasProps } from "Components/Messages/MessageCanvas/MessageCanvas";
import MessageCanvasHeader from "Components/Headers/MessageCanvasHeader/MessageCanvasHeader";
import MessageInput, { MessageInputChangeEvent, MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";
import ChannelList, { ChannelListProps } from "Components/Channels/ChannelList/ChannelList";

import type { Page } from "DataTypes/Components";
import { SENDMessage } from "NSLib/APIEvents";
import MessageAttachment from "DataTypes/MessageAttachment";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import type { ChannelClickEvent } from "Components/Channels/Channel/Channel";
import { IMessageProps } from "Interfaces/IMessageProps";

interface ChatPageProps extends Page {
  channels?: IRawChannelProps[],
  messages?: IMessageProps[],
  selectedChannel?: IRawChannelProps,
  onChannelClick?: (event: ChannelClickEvent) => void
}

function ChatPage({ channels, messages, selectedChannel, onChannelClick }: ChatPageProps) {
  const [MessageInputValue, setMessageInputValue] = useState("");

  const MessageInputChangedHandler = (event: MessageInputChangeEvent) => {
    const value = event && event.value ? event.value : "";
    setMessageInputValue(value);
  }

  const MessageInputSendHandler = (event: MessageInputSendEvent) => {
    // TODO: Handle sending messages here (you can get the message from either the state (MessageInputValue) or from the event itself)
    if (selectedChannel === undefined || event.value === undefined) return;
    SENDMessage(selectedChannel.table_Id, event.value, [] as MessageAttachment[], (sent: boolean) => {
      if (sent) {
        console.log("Message sent");
        setMessageInputValue("");
      }
    });
  }

  return (
    <PageContainer noPadding>
      <div className="ChatPageContainer">
        <div className="ChatPageContainerLeft">
          <ChannelList channels={channels} onChannelClick={onChannelClick} selectedChannel={selectedChannel} />
        </div>
        <div className="ChatPageContainerRight">
          <MessageCanvasHeader selectedChannel={selectedChannel}></MessageCanvasHeader>
          <MessageCanvas className="ChatPageContainerItem" messages={messages}/>
          <MessageInput className="ChatPageContainerItem" value={MessageInputValue} onChange={MessageInputChangedHandler} onSend={MessageInputSendHandler} />
        </div>
      </div>
    </PageContainer>
  );
}

export default ChatPage;
