import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import Message, { MessageProps } from "Components/Messages/Message/Message";

import type { NCAPIComponent } from "DataTypes/Components";
import type { IMessageProps } from "Interfaces/IMessageProps";
import { useEffect, useRef } from "react";

export interface MessageCanvasProps extends NCAPIComponent {
  innerClassName?: string,
  messages?: IMessageProps[],
  canvasRef?: React.MutableRefObject<HTMLDivElement>,
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void,
  onLoadPriorMessages?: () => void
}

function MessageCanvas(props: MessageCanvasProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageCanvasContainer", props.className);
  const innerClassNames = useClassNames("TheActualMessageCanvas", props.innerClassName);
  const lastScrollPos = useRef(0);

  const messagesArray = () => {
    if (props.messages && props.messages.length > 0) {
      return props.messages.map((message, index) => {
        return (<Message key={message.message_Id} sharedProps={props.sharedProps} content={message.content} attachments={message.attachments} id={message.message_Id} authorID={message.author_UUID} avatarURL={message.avatar} author={message.author} timestamp={message.timestamp} editedTimestamp={message.editedTimestamp} isEdited={message.edited} onMessageEdit={props.onMessageEdit} onMessageDelete={props.onMessageDelete} />)
      }).reverse();
    }
  }

  const onScroll = () => {
    const scrollTop = props.canvasRef?.current.scrollTop;
    if (scrollTop !== undefined) {
      if (scrollTop - lastScrollPos.current < -5 && scrollTop < 10 && props.onLoadPriorMessages !== undefined) {
        props.onLoadPriorMessages();
      }
      lastScrollPos.current = scrollTop;
    }
  };

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.default }} ref={props.canvasRef} onScroll={onScroll}>
      <div className={innerClassNames}>
        {messagesArray()}
      </div>
    </div>
  );
}

export default MessageCanvas;
