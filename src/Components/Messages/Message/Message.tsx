import { Avatar, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import useSettingsManager from "Hooks/useSettingsManager";

import MessageMedia from "Components/Messages/MessageMedia/MessageMedia";

import type { NCComponent } from "DataTypes/Components";
import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";
import type { IAttachmentProps } from "Interfaces/IAttachmentProps";

export interface MessageProps extends NCComponent {
  content?: string,
  attachments?: IAttachmentProps[],
  id?: string,
  authorID?: string,
  avatarURL?: string,
  author?: string,
  timestamp?: string,
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void
}

function Message({ ContextMenu, content, attachments, id, authorID, avatarURL, author, timestamp, onMessageEdit, onMessageDelete }: MessageProps) {
  const theme = useTheme();
  const settingsManager = useSettingsManager();
  const filteredMessageProps: MessageProps = { content, id, avatarURL, author, timestamp };
  const Localizations_Message = useTranslation("Message").t;
  const [isHovering, setHoveringState] = useState(false);

  const isOwnMessage = authorID === settingsManager.User.uuid;

  const editMessage = () => {
    if (onMessageEdit) onMessageEdit(filteredMessageProps);
    // TODO: Add message editing UI logic here
  }

  const copyMessage = () => {
    // TODO: Implement copying content to clipboard
  }

  const messageContextMenuItems: ContextMenuItemProps[] = [
    { children: Localizations_Message("ContextMenuItem-Copy"), onLeftClick: () => copyMessage()},
    { disabled: !isOwnMessage, children: Localizations_Message("ContextMenuItem-Edit"), onLeftClick: () => editMessage()},
    { disabled: !isOwnMessage, children: Localizations_Message("ContextMenuItem-Delete"), onLeftClick: () => { if (onMessageDelete) onMessageDelete(filteredMessageProps) }}
  ]

  const mouseHoverEventHandler = (isHovering: boolean) => {
    setHoveringState(isHovering);
  }

  const messageRightClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if (ContextMenu && event.currentTarget) {
      ContextMenu.setAnchor(event.currentTarget);
      ContextMenu.setItems(messageContextMenuItems);
      ContextMenu.setVisibility(true);
    }
    event.preventDefault();
  }

  const mediaComponents = () => {
    return <MessageMedia contentUrl="https://www.akc.org/wp-content/uploads/2018/05/samoyed-mother-dog-with-puppy-outdoors.jpg" />

    /*if (attachments && attachments.length > 0) {
      return attachments.map((attachment, index) => {
        return (
          <MessageMedia content={attachment.content} contentUrl={attachment.contentUrl} filename={attachment.filename} size={attachment.size} contentWidth={attachment.contentWidth} contentHeight={attachment.contentHeight} />
        )
      });
    }*/
  }

  return (
    <div className="MessageContainer" style={{ backgroundColor: "transparent" }}>
      <div className="MessageLeft">
        <Avatar src={`${avatarURL}`} />
      </div>
      <div className="MessageRight" style={{ backgroundColor: isHovering ? theme.customPalette.customActions.messageHover : theme.customPalette.messageBackground }} onMouseEnter={() => mouseHoverEventHandler(true)} onMouseLeave={() => mouseHoverEventHandler(false)} onContextMenu={messageRightClickHandler}>
        <div className="MessageRightHeader">
          <Typography className="MessageName" fontWeight="bold">{author}</Typography>
          <Typography className="MessageTimestamp" variant="subtitle2">{timestamp}</Typography>
        </div>
        <Typography variant="body1">{content}</Typography>
        <div className="MessageMediaContainer">
          {mediaComponents()}
        </div>
      </div>
    </div>
  )
}

export default Message;
