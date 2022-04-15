import { Button, TextField } from "@mui/material";
import { useState } from "react";

import PageContainer from "Components/Containers/PageContainer/PageContainer";
import MessageCanvas, { MessageCanvasProps } from "Components/Messages/MessageCanvas/MessageCanvas";
import MessageInput, { MessageInputChangeEvent, MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";
import ChannelList, { ChannelListProps } from "Components/Channels/ChannelList/ChannelList";

import type { Page } from "DataTypes/Components";
import type { ChangeEvent } from "react";

interface ChatPageProps extends Page {
  channelData?: ChannelListProps
  messageData?: MessageCanvasProps
}

function ChatPage({ channelData, messageData }: ChatPageProps) {
  const [MessageInputValue, setMessageInputValue] = useState("");

  const MessageInputChangedHandler = (event: MessageInputChangeEvent) => {
    const value = event && event.value ? event.value : "";
    setMessageInputValue(value);
  }

  const MessageInputSendHandler = (event: MessageInputSendEvent) => {
    // TODO: Handle sending messages here (you can get the message from either the state (MessageInputValue) or from the event itself)
  }

  return (
    <PageContainer noPadding>
      <div className="ChatPageContainer">
        <div className="ChatPageContainerLeft">
          <ChannelList channels={channelData?.channels} onChannelClick={channelData?.onChannelClick} />
        </div>
        <div className="ChatPageContainerRight">
          <MessageCanvas messages={messageData?.messages}/>
          <MessageInput value={MessageInputValue} onChange={MessageInputChangedHandler} onSend={MessageInputSendHandler} />
        </div>
      </div>
    </PageContainer>
  );
}

export default ChatPage;
