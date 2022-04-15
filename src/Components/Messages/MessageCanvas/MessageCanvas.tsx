import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import Message from "Components/Messages/Message/Message";

import type { NCComponent } from "DataTypes/Components";
import type { IMessageProps } from "Interfaces/IMessageProps";


export interface MessageCanvasProps extends NCComponent {
  innerClassName?: string,
  messages?: IMessageProps[]
}

function MessageCanvas({ className, innerClassName, messages }: MessageCanvasProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageCanvasContainer", className);
  const innerClassNames = useClassNames("TheActualMessageCanvas", innerClassName);

  const messagesArray = () => {
    if (messages && messages.length > 0) {
      return messages.map((message, index) => {
        return (<Message key={message.message_Id} content={message.content} avatarURL={message.avatar} author={message.author} timestamp={message.timestamp}/>)
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
