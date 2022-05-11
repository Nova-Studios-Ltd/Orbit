import { Avatar, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import useSettingsManager from "Hooks/useSettingsManager";

import MessageMedia from "Components/Messages/MessageMedia/MessageMedia";

import type { NCComponent } from "DataTypes/Components";
import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";
import { AttachmentProps, IAttachmentProps } from "Interfaces/IAttachmentProps";
import { WriteToClipboard } from "NSLib/ElectronAPI";
import { GetImageDimensions, GetMimeType } from "NSLib/ContentLinkUtil";
import { FileType } from "NSLib/MimeTypeParser";

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
  const [allAttachments, setAttachments] = useState([] as IAttachmentProps[]);

  const isOwnMessage = authorID === settingsManager.User.uuid;


  useEffect(() => {
    if (attachments === undefined) return;
    async function processMedia() {
      // Handle getting links
      if (content === undefined) return;
      const att = [] as IAttachmentProps[];
      const links = content.split(" ");
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.match(/((https|http):\/\/[\S]*)/g) === null) continue;
        const type = await GetMimeType(link);
        if (type === FileType.Image) {
          const size = await GetImageDimensions(link);
          att.push(new AttachmentProps(link, new Uint8Array(), "Unknown", "image/png", 0, size.width, size.height, true));
        }
        else if (type === FileType.Video) {
          att.push(new AttachmentProps(link, new Uint8Array(), "Unknown", "video/mp4", 0, 0, 0, true));
        }
      }
      if (attachments === undefined) return;
      setAttachments([...att, ...attachments]);
    }
    processMedia();
  }, []);


  const editMessage = () => {
    if (onMessageEdit) onMessageEdit(filteredMessageProps);
    // TODO: Add message editing UI logic here
  }

  const copyMessage = () => {
    if (content === undefined) return;
    WriteToClipboard(content);
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
      ContextMenu.setAnchor({ x: event.clientX, y: event.clientY });
      ContextMenu.setItems(messageContextMenuItems);
      ContextMenu.setVisibility(true);
    }
    event.preventDefault();
  }

  const mediaComponents = () => {
    if (allAttachments && allAttachments.length > 0) {
      return allAttachments.map((attachment, index) => {
        return (
          <MessageMedia key={`${id}-${index}`} content={attachment.content} contentUrl={attachment.contentUrl} fileName={attachment.filename} fileSize={attachment.size} mimeType={attachment.mimeType} contentWidth={attachment.contentWidth} contentHeight={attachment.contentHeight} isExternal={attachment.isExternal}/>
        )
      });
    }
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
        <TextField className="MessageEditField" style={{display: "none"}} />
      </div>
    </div>
  )
}

export default Message;
