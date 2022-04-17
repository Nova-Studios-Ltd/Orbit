import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import useClassNames from "Hooks/useClassNames";

import MessageCanvas from "Components/Messages/MessageCanvas/MessageCanvas";
import MessageCanvasHeader from "Components/Headers/MessageCanvasHeader/MessageCanvasHeader";
import MessageInput, { MessageInputChangeEvent, MessageInputSendEvent } from "Components/Input/MessageInput/MessageInput";

import { ChatViewRoutes } from "DataTypes/Routes";
import type { View } from "DataTypes/Components";
import type { IMessageProps } from "Interfaces/IMessageProps";
import type { MessageProps } from "Components/Messages/Message/Message";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";

interface ChatViewProps extends View {
  path?: ChatViewRoutes,
  messages?: IMessageProps[],
  selectedChannel?: IRawChannelProps,
  MessageInputValue?: string,
  MessageInputChangedHandler: (event: MessageInputChangeEvent) => void,
  MessageInputSendHandler: (event: MessageInputSendEvent) => void,
  handleFileUpload?: () => void,
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void
}

function ChatView({ className, ContextMenu, HelpPopup, widthConstrained, path, messages, selectedChannel, MessageInputValue, MessageInputChangedHandler, MessageInputSendHandler, handleFileUpload, onMessageEdit, onMessageDelete, changeTitleCallback }: ChatViewProps) {
  const classNames = useClassNames("ChatViewContainer", className);

  const page = () => {
    switch (path) {
      case ChatViewRoutes.Chat:
        return (
          <>
            <MessageCanvasHeader selectedChannel={selectedChannel}></MessageCanvasHeader>
            <MessageCanvas className="ChatPageContainerItem" ContextMenu={ContextMenu} messages={messages} onMessageEdit={onMessageEdit} onMessageDelete={onMessageDelete} />
            <MessageInput className="ChatPageContainerItem" value={MessageInputValue} onFileUpload={handleFileUpload} onChange={MessageInputChangedHandler} onSend={MessageInputSendHandler} />
          </>
        )
      case ChatViewRoutes.Friends:
        break;
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
