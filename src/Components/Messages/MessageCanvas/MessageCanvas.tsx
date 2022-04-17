import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import Message, { MessageProps } from "Components/Messages/Message/Message";

import type { NCAPIComponent } from "DataTypes/Components";
import type { IMessageProps } from "Interfaces/IMessageProps";

export interface MessageCanvasProps extends NCAPIComponent {
  innerClassName?: string,
  messages?: IMessageProps[],
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void
}

function MessageCanvas({ className, ContextMenu, innerClassName, messages, onMessageEdit, onMessageDelete }: MessageCanvasProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageCanvasContainer", className);
  const innerClassNames = useClassNames("TheActualMessageCanvas", innerClassName);

  const messagesArray = () => {
    if (messages && messages.length > 0) {
      return messages.map((message, index) => {
        return (<Message key={message.message_Id} ContextMenu={ContextMenu} content={message.content} attachments={message.attachments} id={message.message_Id} authorID={message.author_UUID} avatarURL={message.avatar} author={message.author} timestamp={message.timestamp} onMessageEdit={onMessageEdit} onMessageDelete={onMessageDelete} />)
      }).reverse();
    }
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.default }}>
      <div className={innerClassNames}>
        {messagesArray()}
      </div>
    </div>
  )
}

export default MessageCanvas;
