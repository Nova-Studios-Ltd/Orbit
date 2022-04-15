import { useState } from "react";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import MessageCanvas, { MessageCanvasProps } from "Components/Messages/MessageCanvas/MessageCanvas";
import MessageInput, { MessageInputChangeEvent, MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";
import ChannelList, { ChannelListProps } from "Components/Channels/ChannelList/ChannelList";

import type { Page } from "DataTypes/Components";
import { SENDMessage } from "NSLib/APIEvents";
import MessageAttachment from "DataTypes/MessageAttachment";

interface ChatPageProps extends Page {
  channelData?: ChannelListProps
  messageData?: MessageCanvasProps
  channel_uuid?: string
}

function ChatPage({ channelData, messageData, channel_uuid }: ChatPageProps) {
  const [MessageInputValue, setMessageInputValue] = useState("");

  const MessageInputChangedHandler = (event: MessageInputChangeEvent) => {
    const value = event && event.value ? event.value : "";
    setMessageInputValue(value);
  }

  const MessageInputSendHandler = (event: MessageInputSendEvent) => {
    // TODO: Handle sending messages here (you can get the message from either the state (MessageInputValue) or from the event itself)
    if (channel_uuid === undefined || event.value === undefined) return;
    SENDMessage(channel_uuid, event.value, [] as MessageAttachment[], (sent: boolean) => {
      if (sent)
        console.log("Message sent");
    });
  }

  return (
    <PageContainer noPadding>
      <div className="ChatPageContainer">
        <div className="ChatPageContainerLeft">
          <ChannelList channels={channelData?.channels} onChannelClick={channelData?.onChannelClick} />
        </div>
        <div className="ChatPageContainerRight">
          <MessageCanvas className="ChatPageContainerItem" messages={messageData?.messages}/>
          <MessageInput className="ChatPageContainerItem" value={MessageInputValue} onChange={MessageInputChangedHandler} onSend={MessageInputSendHandler} />
        </div>
      </div>
    </PageContainer>
  );
}

export default ChatPage;
