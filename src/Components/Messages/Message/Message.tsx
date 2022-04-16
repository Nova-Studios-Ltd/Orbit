import { Avatar, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import type { NCComponent } from "DataTypes/Components";
import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";

export interface MessageProps extends NCComponent {
  content?: string,
  id?: string,
  avatarURL?: string,
  author?: string,
  timestamp?: string,
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void
}

function Message({ ContextMenu, content, id, avatarURL, author, timestamp, onMessageEdit, onMessageDelete }: MessageProps) {
  const theme = useTheme();
  const filteredMessageProps: MessageProps = { content, id, avatarURL, author, timestamp };
  const Localizations_Message = useTranslation("Message").t;
  const [isHovering, setHoveringState] = useState(false);

  const editMessage = () => {
    if (onMessageEdit) onMessageEdit(filteredMessageProps);
    // TODO: Add message editing UI logic here
  }

  const messageContextMenuItems: ContextMenuItemProps[] = [
    { children: Localizations_Message("ContextMenuItem-Edit"), onLeftClick: () => editMessage()},
    { children: Localizations_Message("ContextMenuItem-Delete"), onLeftClick: () => { if (onMessageDelete) onMessageDelete(filteredMessageProps) }}
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
      </div>
    </div>
  )
}

export default Message;
