import React, { useCallback, useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import useClassNames from "Hooks/useClassNames";

import Message, { MessageProps } from "Components/Messages/Message/Message";
import PageContainer from "Components/Containers/PageContainer/PageContainer";

import type { NCAPIComponent } from "Types/UI/Components";
import type { IMessageProps } from "Types/API/Interfaces/IMessageProps";

export interface MessageCanvasProps extends NCAPIComponent {
  innerClassName?: string,
  messages?: IMessageProps[],
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void,
  onLoadPriorMessages?: () => void
}

function MessageCanvas(props: MessageCanvasProps) {
  const Localizations_MessageCanvas = useTranslation("MessageCanvas").t;
  const classNames = useClassNames("MessageCanvasContainer", props.className);
  const innerClassNames = useClassNames("TheActualMessageCanvas", props.innerClassName);

  const canvasRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const lastScrollPos = useRef(0);
  const messageCount = useRef(props.messages?.length || 0);

  const setCanvasRef = useCallback((element: HTMLDivElement) => {
    if (element) {
      canvasRef.current = element;
    }
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const scrollHeight = canvasRef.current.scrollHeight;
      const scrollOffset = canvasRef.current.offsetHeight;
      const scrollTop = canvasRef.current.scrollTop;

      if (props.messages && props.messages.length === messageCount.current) return;

      if (lastScrollPos.current && (lastScrollPos.current - scrollOffset) === scrollTop) {
        const distance = scrollHeight - scrollTop;
        if (distance < scrollHeight / 5)
          canvas.scroll({ top: scrollHeight, behavior: "smooth" });
        else
          canvas.scrollTop = scrollHeight;
      }
    }
  }, [props.messages])

  const NoMessagesHint = (
    <div className="NoMessagesHintContainer">
      <Typography variant="h6">{Localizations_MessageCanvas("Typography_Heading-NoMessagesHint")}</Typography>
      <Typography variant="body1">{Localizations_MessageCanvas("Typography_Body-NoMessagesHint")}</Typography>
    </div>
  );

  const messagesArray = () => {
    if (props.messages && props.messages.length > 0) {
      return props.messages.map((message, index) => {
        return (<Message key={message.message_Id} content={message.content} attachments={message.attachments} id={message.message_Id} authorID={message.author_UUID} avatarURL={message.avatar} timestamp={message.timestamp} editedTimestamp={message.editedTimestamp} isEdited={message.edited} encrypted={message.encrypted} onMessageEdit={props.onMessageEdit} onMessageDelete={props.onMessageDelete} />)
      }).reverse();
    }

    return NoMessagesHint;
  }

  const onScroll = () => {
    if (canvasRef.current !== undefined) {
      const scrollTop = canvasRef.current.scrollTop;

      if (scrollTop - lastScrollPos.current < -5 && scrollTop < 10 && props.onLoadPriorMessages !== undefined) {
        props.onLoadPriorMessages();
      }
      lastScrollPos.current = scrollTop;
    }
  };

  return (
    <PageContainer className={classNames}>
      <div className={classNames} ref={setCanvasRef} onScroll={onScroll}>
        <div className={innerClassNames}>
          {messagesArray()}
        </div>
      </div>
    </PageContainer>
  );
}

export default MessageCanvas;
