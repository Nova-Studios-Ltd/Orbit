import { useTheme } from "@mui/material";

import Message from "Components/Messages/Message/Message";

import type { NCComponent } from "DataTypes/Components";
import type { IMessageProps } from "Interfaces/IMessageProps";


export interface MessageCanvasProps extends NCComponent {
  messages?: IMessageProps[]
}

function MessageCanvas({ messages }: MessageCanvasProps) {
  const theme = useTheme();

  const messagesArray = () => {
    if (messages && messages.length > 0) {
      return messages.map((message, index) => {
        // TODO: Map message instances to component props
        return (<Message content={message.content} avatarURL={message.avatar} author={message.author} timestamp={message.timestamp}/>)
      }).reverse();
    }
  }

  return (
    <div className="MessageCanvasContainer" style={{ backgroundColor: theme.palette.background.paper }}>
      <div className="TheActualMessageCanvas">
        {messagesArray()}
      </div>
    </div>
  )
}

export default MessageCanvas;
