import { Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
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
  const Localizations_MessageCanvas = useTranslation("MessageCanvas").t;
  const theme = useTheme();
  const classNames = useClassNames("MessageCanvasContainer", props.className);
  const innerClassNames = useClassNames("TheActualMessageCanvas", props.innerClassName);
  const lastScrollPos = useRef(0);

  const NoMessagesHint = (
    <div className="NoMessagesHintContainer">
      <Typography variant="h6">{Localizations_MessageCanvas("Typography_Heading-NoMessagesHint")}</Typography>
      <Typography variant="body1">{Localizations_MessageCanvas("Typography_Body-NoMessagesHint")}</Typography>
    </div>
  );

  const messagesArray = () => {
    if (props.messages && props.messages.length > 0) {
      return props.messages.map((message, index) => {
        return (<Message key={message.message_Id} sharedProps={props.sharedProps} content={message.content} attachments={message.attachments} id={message.message_Id} authorID={message.author_UUID} avatarURL={message.avatar} author={message.author} timestamp={message.timestamp} editedTimestamp={message.editedTimestamp} isEdited={message.edited} onMessageEdit={props.onMessageEdit} onMessageDelete={props.onMessageDelete} />)
      }).reverse();
    }

    return NoMessagesHint;
  }

  const onScroll = () => {
    const scrollTop = props.canvasRef?.current.scrollTop;
    if (scrollTop !== undefined && props.canvasRef !== undefined) {
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
