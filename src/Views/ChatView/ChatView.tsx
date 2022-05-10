import { useEffect, useRef } from "react";
import useClassNames from "Hooks/useClassNames";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import MessageCanvas from "Components/Messages/MessageCanvas/MessageCanvas";
import MessageCanvasHeader from "Components/Headers/MessageCanvasHeader/MessageCanvasHeader";
import MessageInput, { MessageInputChangeEvent, MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";

import FriendPage from "Pages/FriendPage/FriendPage";

import { ChatViewRoutes } from "DataTypes/Routes";
import type { View } from "DataTypes/Components";
import type { IMessageProps } from "Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";

interface ChatViewProps extends View {
  path?: ChatViewRoutes,
  messages?: IMessageProps[],
  selectedChannel?: IRawChannelProps,
  onChannelCreate?: (recipient: string) => void,
  MessageInputSendHandler: (event: MessageInputSendEvent) => void,
  handleFileUpload?: () => void,
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void
}

function ChatView({ className, ContextMenu, HelpPopup, widthConstrained, path, messages, selectedChannel, onChannelCreate, MessageInputSendHandler, handleFileUpload, onMessageEdit, onMessageDelete, changeTitleCallback }: ChatViewProps) {
  const classNames = useClassNames("ChatViewContainer", className);
  const canvasRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const messageCount = useRef(0);

  const scrollCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.scroll({ top: canvas.scrollHeight, behavior: "smooth" });
    }
  }

  useEffect(() => {
    if (messages) {
      if (messageCount.current < messages.length) scrollCanvas();
      messageCount.current = messages.length;
    }
  }, [messages, messages?.length]);

  const page = () => {
    switch (path) {
      case ChatViewRoutes.Chat:
        return (
          <>
            <MessageCanvasHeader selectedChannel={selectedChannel}></MessageCanvasHeader>
            <MessageCanvas className="ChatPageContainerItem" canvasRef={canvasRef} ContextMenu={ContextMenu} messages={messages} onMessageEdit={onMessageEdit} onMessageDelete={onMessageDelete} />
            <MessageInput className="ChatPageContainerItem" onFileUpload={handleFileUpload} onSend={MessageInputSendHandler} />
          </>
        )
      case ChatViewRoutes.Friends:
        return (<FriendPage ContextMenu={ContextMenu} widthConstrained={widthConstrained} HelpPopup={HelpPopup} changeTitleCallback={changeTitleCallback} onChannelCreate={onChannelCreate} />);
      default:
        return null;
    }
  }

  return (
    <ViewContainer className={classNames} noPadding>
      {page()}
    </ViewContainer>
  );
}

export default ChatView;
