// Globals
import React, { useEffect, useState } from "react";
import { Avatar, IconButton, Link, Typography, useTheme } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import JSZip from "jszip";

// Redux
import { useSelector } from "Redux/Hooks";

// Components
import ContextMenuItem from "Components/Menus/ContextMenuItem/ContextMenuItem";
import MessageMedia from "Components/Messages/MessageMedia/MessageMedia";
import TextCombo, { TextComboChangeEvent, TextComboSubmitEvent } from "Components/Input/TextCombo/TextCombo";

// Types
import type { NCComponent } from "Types/UI/Components";
import { AttachmentProps, IAttachmentProps } from "Types/API/Interfaces/IAttachmentProps";
import { FileType } from "Lib/Utility/MimeTypeParser";
import IUserData from "Types/API/Interfaces/IUserData";
import ContextMenu from "Components/Menus/ContextMenu/ContextMenu";
import { Coordinates } from "Types/General";
import Linkify from "linkify-react";

// Source
import { GETBuffer } from "Lib/API/NetAPI/NetAPI";
import { HTTPStatus } from "Lib/API/NetAPI/HTTPStatus";
import UserData from "Lib/Storage/Objects/UserData";
import { GetImageSize, GetMimeType } from "Lib/Utility/ContentUtility";
import { DownloadUint8ArrayFile, WriteToClipboard } from "Lib/ElectronAPI";
import { RSADecrypt } from "Lib/Encryption/RSA";
import Base64Uint8Array from "Lib/Objects/Base64Uint8Array";
import { AESDecrypt } from "Lib/Encryption/AES";
import { AESMemoryEncryptData } from "Lib/Encryption/Types/AESMemoryEncryptData";
import { uCache } from "App";
import { NetHeaders } from "Lib/API/NetAPI/NetHeaders";

export interface MessageProps extends NCComponent {
  content?: string,
  attachments?: IAttachmentProps[],
  id?: string,
  authorID?: string,
  avatarURL?: string,
  timestamp?: string,
  editedTimestamp?: string,
  isEdited?: boolean,
  encrypted?: boolean,
  onMessageEdit?: (message: MessageProps) => void,
  onMessageDelete?: (message: MessageProps) => void
}

function Message(props: MessageProps) {
  const theme = useTheme();
  const filteredMessageProps: MessageProps = { content: props.content, id: props.id, avatarURL: props.avatarURL, timestamp: props.timestamp };
  const Localizations_Message = useTranslation("Message").t;
  const Localizations_ContextMenuItem = useTranslation("ContextMenuItem").t;

  const isOwnMessage = props.authorID === UserData.Uuid;
  const isTouchCapable = useSelector(state => state.app.isTouchCapable);

  const [isHovering, setHoveringState] = useState(false);
  const [isEditing, setEditingState] = useState(false);
  const [isLinkClicked, setLinkClickedState] = useState(false);
  const [editFieldValue, setEditFieldValue] = useState("" as string | undefined);
  const [allAttachments, setAttachments] = useState([] as IAttachmentProps[]);
  const [displayName, setDisplayName] = useState(uCache.GetUser(props.authorID || "")?.username || "");
  const [selectedAttachment, setSelectedAttachment] = useState(null as unknown as IAttachmentProps);
  const [ContextMenuVisible, setContextMenuVisibility] = useState(false);
  const [ContextMenuAnchorPos, setContextMenuAnchorPos] = useState(null as unknown as Coordinates);

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
          const size = await GetImageSize(link);
          if (size.height === -1) continue;
          att.push(new AttachmentProps(link, new Uint8Array(), "Unknown", "image/png", 0, size.width, size.height, {}, "", true));
        }
        else if (type === FileType.Video) {
          att.push(new AttachmentProps(link, new Uint8Array(), "Unknown", "video/mp4", 0, 0, 0, {}, "", true));
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

  const handleURLClick = (url: string) => {
    // Perhaps use custom viewer instead of opening externally?
    setLinkClickedState(true);
    window.open(url);
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
    setContextMenuVisibility(false);
  }

  const editMessageFieldChangedHandler = (event: TextComboChangeEvent) => {
    setEditFieldValue(event.value);
  }

  const mouseHoverEventHandler = (isHovering: boolean) => {
    setHoveringState(isHovering);
  }

  const messageRightClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    setSelectedAttachment(null as unknown as IAttachmentProps);
    showContextMenu({ x: event.clientX, y: event.clientY });
    event.preventDefault();
  }

  const messageLeftClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isLinkClicked) {
      setLinkClickedState(false)
      return;
    }

    if (isTouchCapable && !isEditing) messageRightClickHandler(event);
  }

  const attachmentLeftClickHandler = (event: React.MouseEvent<HTMLDivElement>, attachment: IAttachmentProps) => {
    setSelectedAttachment(attachment);
  }

  const attachmentRightClickHandler = (event: React.MouseEvent<HTMLDivElement>, attachment: IAttachmentProps) => {
    setSelectedAttachment(attachment);
    showContextMenu({ x: event.clientX, y: event.clientY });
  }

  const downloadSelectedAttachment = () => {
    if (selectedAttachment && selectedAttachment.content) {
      DownloadUint8ArrayFile(selectedAttachment.content, selectedAttachment.filename);
      return;
    }
    console.warn("File does not contain content to download");
  };

  const downloadAllAttachments = async () => {
    if (props.attachments === undefined) return;
    // Create zip file with all attachments in it
    const zip = new JSZip();
    for (var i = 0; i < props.attachments.length; i++) {
      // Download (Or pull from cache) all attachments, decrypt and compress them
      const att = props.attachments[i];
      const file = await GETBuffer(att.contentUrl, new NetHeaders().WithAuthorization(UserData.Token));
      const att_key = await RSADecrypt(UserData.KeyPair.PrivateKey, new Base64Uint8Array(att.keys[UserData.Uuid]));
      const decryptedContent = await AESDecrypt(att_key, new AESMemoryEncryptData(new Base64Uint8Array(att.iv), file.payload as Base64Uint8Array));
      if (file.status !== HTTPStatus.OK) continue;
      zip.file(att.filename, decryptedContent);
    }
    // Generate Zip
    const compressedZip = await zip.generateAsync({type: "uint8array"});
    // Trigger download
    DownloadUint8ArrayFile(compressedZip, `message-${props.id}-attachments.zip`);
  };

  if (props.authorID !== undefined && displayName === "") {
    uCache.GetUserAsync(props.authorID).then((user: IUserData) => {
      setDisplayName(`${user.username}`);
    });
  }

  const mediaComponents = () => {
    if (allAttachments && allAttachments.length > 0) {
      return allAttachments.map((attachment, index) => {
        return (
          <MessageMedia key={`${props.id}-${index}`} onLeftClick={attachmentLeftClickHandler} onRightClick={attachmentRightClickHandler} contentUrl={attachment.contentUrl} fileName={attachment.filename} fileSize={attachment.size} rawMimeType={attachment.mimeType} contentWidth={attachment.contentWidth} contentHeight={attachment.contentHeight} isExternal={attachment.isExternal} keys={attachment.keys} iv={attachment.iv}/>
        )
      });
    }
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
          {!props.encrypted ? <Typography className="MessageTimestampEdited" fontWeight="bold" variant="subtitle2" color="red">WARNING: Message content not encrypted!</Typography> : null}
        </div>
        <Typography variant="body1">
          <Linkify options={{ tagName: "span", formatHref: null, format: (value: string) => <Link href={value} onClick={(event) => { handleURLClick(value); event.preventDefault(); }}>{value}</Link> }}>
            {props.content}
          </Linkify>
        </Typography>
        <div className="MessageMediaParentContainer">
          {mediaComponents()}
        </div>
        {isEditing ? <TextCombo className="MessageEditField" autoFocus value={editFieldValue} placeholder={props.content} onChange={editMessageFieldChangedHandler} onSubmit={finishEditMessage} onDismiss={() => setEditingState(false)}
          childrenRight={
            <>
              <IconButton onClick={() => setEditingState(false)}><CloseIcon /></IconButton>
            </>
          } /> : null}
      </div>
      <ContextMenu open={ContextMenuVisible} anchorPos={ContextMenuAnchorPos} onDismiss={closeContextMenu}>
        <ContextMenuItem hide={!selectedAttachment} disabled>{selectedAttachment?.filename}</ContextMenuItem>
        <ContextMenuItem hide={!selectedAttachment} onLeftClick={() => downloadSelectedAttachment()}>{Localizations_ContextMenuItem("ContextMenuItem-Download")}</ContextMenuItem>
        <ContextMenuItem disabled={(props.content !== undefined && props.content.length < 1)} onLeftClick={() => copyMessage()}>{Localizations_ContextMenuItem("ContextMenuItem-Copy")}</ContextMenuItem>
        <ContextMenuItem hide={!isOwnMessage} onLeftClick={() => startEditMessage()}>{Localizations_ContextMenuItem("ContextMenuItem-Edit")}</ContextMenuItem>
        <ContextMenuItem hide={!isOwnMessage} onLeftClick={() => { if (props.onMessageDelete) props.onMessageDelete(filteredMessageProps) }}>{Localizations_ContextMenuItem("ContextMenuItem-Delete")}</ContextMenuItem>
        <ContextMenuItem hide={props.attachments && props.attachments?.length < 2} onLeftClick={() => downloadAllAttachments()}>{Localizations_ContextMenuItem("ContextMenuItem-DownloadAll")}</ContextMenuItem>
      </ContextMenu>
    </div>
  );
}

export default Message;
