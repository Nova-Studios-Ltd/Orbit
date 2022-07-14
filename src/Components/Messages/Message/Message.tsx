import { Avatar, IconButton, Typography, useTheme } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import useSettingsManager from "Hooks/useSettingsManager";

import MessageMedia from "Components/Messages/MessageMedia/MessageMedia";
import TextCombo, { TextComboChangeEvent, TextComboSubmitEvent } from "Components/Input/TextCombo/TextCombo";

import type { NCComponent } from "DataTypes/Components";
import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";
import { AttachmentProps, IAttachmentProps } from "Interfaces/IAttachmentProps";
import { DownloadUint8ArrayFile, WriteToClipboard } from "NSLib/ElectronAPI";
import { GetImageDimensions, GetMimeType } from "NSLib/ContentLinkUtil";
import { FileType } from "NSLib/MimeTypeParser";
import { UserCache } from "Views/MainView/MainView";
import UserData from "DataTypes/UserData";
import IUserData from "Interfaces/IUserData";
import ContextMenu from "Components/Menus/ContextMenu/ContextMenu";
import { Coordinates } from "DataTypes/Types";

export interface MessageProps extends NCComponent {
  content?: string,
  attachments?: IAttachmentProps[],
  id?: string,
  authorID?: string,
  avatarURL?: string,
  timestamp?: string,
  editedTimestamp?: string,
  isEdited?: boolean,
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void
}

function Message(props: MessageProps) {
  const theme = useTheme();
  const settingsManager = useSettingsManager();
  const filteredMessageProps: MessageProps = { content: props.content, id: props.id, avatarURL: props.avatarURL, timestamp: props.timestamp };
  const Localizations_Message = useTranslation("Message").t;

  const isTouchCapable = props.sharedProps && props.sharedProps.isTouchCapable;
  const isOwnMessage = props.authorID === settingsManager.User.uuid;

  const [isHovering, setHoveringState] = useState(false);
  const [isEditing, setEditingState] = useState(false);
  const [editFieldValue, setEditFieldValue] = useState("" as string | undefined);
  const [allAttachments, setAttachments] = useState([] as IAttachmentProps[]);
  const [displayName, setDisplayName] = useState(UserCache.GetUser(props.authorID || "")?.username || "");
  const [selectedAttachment, setSelectedAttachment] = useState(null as unknown as IAttachmentProps);
  const [ContextMenuVisible, setContextMenuVisibility] = useState(false);
  const [ContextMenuAnchorPos, setContextMenuAnchorPos] = useState(null as unknown as Coordinates);
  const [ContextMenuItems, setContextMenuItems] = useState(null as unknown as ContextMenuItemProps[]);

  useEffect(() => {
    if (props.attachments === undefined) return;
    async function processMedia() {
      // Handle getting links
      if (props.content === undefined) return;
      const att = [] as IAttachmentProps[];
      const links = props.content.split(" ");
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.match(/((https|http):\/\/[\S]*)/g) === null) continue;
        const type = await GetMimeType(link);
        if (type === FileType.Image) {
          const size = await GetImageDimensions(link);
          if (size.height === -1) continue;
          att.push(new AttachmentProps(link, new Uint8Array(), "Unknown", "image/png", 0, size.width, size.height, true));
        }
        else if (type === FileType.Video) {
          att.push(new AttachmentProps(link, new Uint8Array(), "Unknown", "video/mp4", 0, 0, 0, true));
        }
      }
      if (props.attachments === undefined) return;
      setAttachments([...att, ...props.attachments]);
    }
    processMedia();
  }, [props, props.attachments, props.content]);

  const startEditMessage = () => {
    setEditingState(true);
    setEditFieldValue(props.content);
  }

  const finishEditMessage = (event: TextComboSubmitEvent) => {
    filteredMessageProps.content = event.value;
    if (props.onMessageEdit) props.onMessageEdit(filteredMessageProps);
    setEditingState(false);
  }

  const copyMessage = () => {
    if (props.content === undefined) return;
    WriteToClipboard(props.content);
  }

  const showContextMenu = (position: Coordinates) => {
    setContextMenuAnchorPos(position);
    setContextMenuVisibility(true);
    // "To fix, one must first break" - some dude probably
  }

  const closeContextMenu = (event: React.FocusEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    setContextMenuAnchorPos(null as unknown as Coordinates);
    setContextMenuVisibility(false);
  }

  const editMessageFieldChangedHandler = (event: TextComboChangeEvent) => {
    setEditFieldValue(event.value);
  }

  const mouseHoverEventHandler = (isHovering: boolean) => {
    setHoveringState(isHovering);
  }

  const downloadSelectedAttachment = () => {
    if (selectedAttachment && selectedAttachment.content) {
      DownloadUint8ArrayFile(selectedAttachment.content, selectedAttachment.filename);
      return;
    }
    console.warn("File does not contain content to download");
  };

  const messageRightClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    setSelectedAttachment(null as unknown as IAttachmentProps);
    showContextMenu({ x: event.clientX, y: event.clientY });
    event.preventDefault();
  }

  const messageLeftClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchCapable) messageRightClickHandler(event);
  }

  const attachmentLeftClickHandler = (event: React.MouseEvent<HTMLDivElement>, attachment: IAttachmentProps) => {
    setSelectedAttachment(attachment);
  }

  const attachmentRightClickHandler = (event: React.MouseEvent<HTMLDivElement>, attachment: IAttachmentProps) => {
    setSelectedAttachment(attachment);
    showContextMenu({ x: event.clientX, y: event.clientY });
  }

  useEffect(() => {
    setContextMenuItems([
    { hide: !selectedAttachment, children: selectedAttachment?.filename, disabled: true },
    { children: Localizations_Message("ContextMenuItem-Copy"), onLeftClick: () => copyMessage()},
    { hide: !selectedAttachment, children: Localizations_Message("ContextMenuItem-Download"), onLeftClick: () => downloadSelectedAttachment() },
    { hide: !isOwnMessage, children: Localizations_Message("ContextMenuItem-Edit"), onLeftClick: () => startEditMessage()},
    { hide: !isOwnMessage, children: Localizations_Message("ContextMenuItem-Delete"), onLeftClick: () => { if (props.onMessageDelete) props.onMessageDelete(filteredMessageProps) }},
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttachment]);

  const mediaComponents = () => {
    if (allAttachments && allAttachments.length > 0) {
      return allAttachments.map((attachment, index) => {
        return (
          <MessageMedia key={`${props.id}-${index}`} onLeftClick={attachmentLeftClickHandler} onRightClick={attachmentRightClickHandler} content={attachment.content} contentUrl={attachment.contentUrl} fileName={attachment.filename} fileSize={attachment.size} mimeType={attachment.mimeType} contentWidth={attachment.contentWidth} contentHeight={attachment.contentHeight} isExternal={attachment.isExternal}/>
        )
      });
    }
  }

  if (props.authorID !== undefined && displayName === "") {
    UserCache.GetUserAsync(props.authorID).then((user: IUserData) => {
      setDisplayName(`${user.username}`);
    });
  }

  return (
    <div className="MessageContainer" style={{ backgroundColor: "transparent" }}>
      <div className="MessageLeft">
        <Avatar src={`${props.avatarURL}`} />
      </div>
      <div className="MessageRight" style={{ backgroundColor: isHovering ? theme.customPalette.customActions.messageHover : theme.customPalette.messageBackground }} onMouseEnter={() => mouseHoverEventHandler(true)} onMouseLeave={() => mouseHoverEventHandler(false)} onClick={messageLeftClickHandler} onContextMenu={messageRightClickHandler}>
        <div className="MessageRightHeader">
          <Typography className="MessageName" fontWeight="bold">{displayName}</Typography>
          <Typography className="MessageTimestamp" variant="subtitle2">{props.timestamp?.replace("T", " ")}</Typography>
          {props.isEdited ? <Typography className="MessageTimestampEdited" variant="subtitle2">({Localizations_Message("Typography-TimestampEdited")} {props.editedTimestamp?.replace("T", " ")})</Typography> : null}
        </div>
        <Typography variant="body1">{props.content}</Typography>
        <div className="MessageMediaParentContainer">
          {mediaComponents()}
        </div>
        {isEditing ? <TextCombo className="MessageEditField" autoFocus value={editFieldValue} textFieldPlaceholder={props.content} onChange={editMessageFieldChangedHandler} onSubmit={finishEditMessage} onDismiss={() => setEditingState(false)}
          childrenRight={
            <>
              <IconButton onClick={() => setEditingState(false)}><CloseIcon /></IconButton>
            </>
          } /> : null}
      </div>
      <ContextMenu open={ContextMenuVisible} anchorPos={ContextMenuAnchorPos} onDismiss={closeContextMenu}>
        {ContextMenuItems}
      </ContextMenu>
    </div>
  )
}

export default Message;
