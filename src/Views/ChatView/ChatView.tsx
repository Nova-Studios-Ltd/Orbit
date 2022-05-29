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
import type MessageAttachment from "DataTypes/MessageAttachment";

interface ChatViewProps extends View {
  path?: ChatViewRoutes,
  messages?: IMessageProps[],
  attachments?: MessageAttachment[],
  selectedChannel?: IRawChannelProps,
  onChannelCreate?: (recipient: string) => void,
  MessageInputSendHandler: (event: MessageInputSendEvent) => void,
  onFileUpload?: () => void,
  onFileRemove?: (id?: string) => void,
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void
}

function ChatView(props: ChatViewProps) {
  const classNames = useClassNames("ChatViewContainer", props.className);
  const canvasRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const messageCount = useRef(0);

  const scrollCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.scroll({ top: canvas.scrollHeight, behavior: "smooth" });
    }
  }

  useEffect(() => {
    if (props.messages) {
      if (messageCount.current < props.messages.length) scrollCanvas();
      messageCount.current = props.messages.length;
    }
  }, [props.messages, props.messages?.length]);

  // This
  const page = () => {
    switch (props.path) {
      case ChatViewRoutes.Chat:
        return (
          <>
            <MessageCanvasHeader selectedChannel={props.selectedChannel}></MessageCanvasHeader>
            <MessageCanvas className="ChatPageContainerItem" canvasRef={canvasRef} ContextMenu={props.ContextMenu} messages={props.messages} onMessageEdit={props.onMessageEdit} onMessageDelete={props.onMessageDelete} />
            <MessageInput className="ChatPageContainerItem" attachments={props.attachments} onFileRemove={props.onFileRemove} onFileUpload={props.onFileUpload} onSend={props.MessageInputSendHandler} />
          </>
        )
      case ChatViewRoutes.Friends:
        return (<FriendPage ContextMenu={props.ContextMenu} widthConstrained={props.widthConstrained} HelpPopup={props.HelpPopup} changeTitleCallback={props.changeTitleCallback} onChannelCreate={props.onChannelCreate} />);
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
