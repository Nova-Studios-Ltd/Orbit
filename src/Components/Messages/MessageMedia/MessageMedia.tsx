import React, { memo, useEffect, useRef, useState } from "react";
//import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { ComputeCSSDims } from "NSLib/Util";
import Dimensions from "Types/Dimensions";
import MimeTypeParser, { FileType } from "NSLib/MimeTypeParser";

import MessageFile from "./Subcomponents/MessageFile/MessageFile";
import MessageImage from "./Subcomponents/MessageImage/MessageImage";
import MessageVideo from "./Subcomponents/MessageVideo/MessageVideo";
import MessageAudio from "./Subcomponents/MessageAudio/MessageAudio";

import type { NCComponent } from "Types/UI/Components";
import type { IAttachmentProps } from "Types/API/Interfaces/IAttachmentProps";
import { Base64String } from "NSLib/Base64";
import { GETFile } from "NSLib/NCAPI";
import { DecryptBase64WithPriv, DecryptUint8Array } from "NSLib/NCEncryption";
import { AESMemoryEncryptData } from "NSLib/NCEncrytUtil";
import { NCFlags, HasUrlFlag } from "NSLib/NCFlags";
import { SettingsManager } from "NSLib/SettingsManager";

export interface MessageMediaProps extends NCComponent {
  contentUrl?: string,
  fileName?: string,
  fileSize?: number,
  rawMimeType?: string,
  mimeType?: FileType,
  contentWidth?: number,
  contentHeight?: number,
  isExternal?: boolean,
  keys?: { [key: string] : string; },
  iv?: string,
  onLeftClick?: (event: React.MouseEvent<HTMLDivElement>, attachment: IAttachmentProps) => void,
  onRightClick?: (event: React.MouseEvent<HTMLDivElement>, attachment: IAttachmentProps) => void
}

function MessageMedia(props: MessageMediaProps) {
  //const theme = useTheme();
  const classNames = useClassNames("MessageMediaContainer", props.className);
  const isPreviewableMediaType = useRef(false);
  const [dimensions, setDimensions] = useState({});

  const [contentDataUrl, setContentDataUrl] = useState("");
  const contentData = useRef(new Uint8Array());

  useEffect(() => {
    (async () => {
      // Url control variable
      if (HasUrlFlag(NCFlags.NoLoadContent)) return;

      // First confirm contentUrl/keys/iv is not undefined
      if (props.contentUrl === undefined || props.keys === undefined || props.iv === undefined) return;

      // Now we grab the content itself
      const manager = new SettingsManager();
      const content = await GETFile(props.contentUrl, manager.User.token, props.isExternal);

      // don't decrypt the data if the media is external
      if (props.isExternal) {
        setContentDataUrl(URL.createObjectURL(new Blob([content.payload as Uint8Array])));
        return;
      }

      // and decrypt the data
      const att_key = await DecryptBase64WithPriv(manager.User.keyPair.PrivateKey, new Base64String(props.keys[manager.User.uuid]));
      const decryptedContent = await DecryptUint8Array(att_key, new AESMemoryEncryptData(props.iv, content.payload as Uint8Array));

      contentData.current = decryptedContent;
      setContentDataUrl(URL.createObjectURL(new Blob([decryptedContent])));
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    let _dimensions = {};

    if (props.contentWidth && props.contentHeight) {
      const size = ComputeCSSDims(new Dimensions(props.contentWidth, props.contentHeight), new Dimensions(575, 400));
      _dimensions = props.sharedProps?.widthConstrained ? { width: "100%", height: "auto" } : { width: size.width > 0 ? size.width : "18rem", height: size.height > 0 ? size.height : "30rem" };
    }

    if (isPreviewableMediaType.current) {
      setDimensions(_dimensions);
    }
  }, [props.contentWidth, props.contentHeight, props.sharedProps?.widthConstrained]);

  const onMediaClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const attachmentProps = { contentUrl: props.contentUrl || "", content: contentData.current || new Uint8Array(), filename: props.fileName || "", mimeType: props.rawMimeType || "", size: props.fileSize || 0, contentWidth: props.contentWidth || 0, contentHeight: props.contentHeight || 0, keys: {}, iv: "", isExternal: props.isExternal || false };

    if (event.button === 0) { // Left Click
      if (props.onLeftClick) props.onLeftClick(event, attachmentProps);

    }
    else if (event.button === 2) { // Right Click
      if (props.onRightClick) props.onRightClick(event, attachmentProps);
    }
  }

  const mediaElement = () => {
    if (props.rawMimeType && props.rawMimeType.length > 0) {
      const parsedMimeType = new MimeTypeParser(props.rawMimeType).getGeneralizedFileType();
      switch (parsedMimeType) {
        case FileType.Image:
          isPreviewableMediaType.current = true;
          if (props.isExternal) return (<MessageImage contentUrl={contentDataUrl} fileName={props.fileName} rawMimeType={props.rawMimeType} mimeType={parsedMimeType} fileSize={props.fileSize} contentWidth={props.contentWidth} contentHeight={props.contentHeight} keys={props.keys} iv={props.iv} />);
          return (<MessageImage contentUrl={contentDataUrl} fileName={props.fileName} rawMimeType={props.rawMimeType} mimeType={parsedMimeType} fileSize={props.fileSize} contentWidth={props.contentWidth} contentHeight={props.contentHeight} keys={props.keys} iv={props.iv} />);
        case FileType.Video:
          isPreviewableMediaType.current = true;
          if (props.isExternal) return (<MessageVideo contentUrl={contentDataUrl} fileName={props.fileName} rawMimeType={props.rawMimeType} mimeType={parsedMimeType} fileSize={props.fileSize} contentWidth={props.contentWidth} contentHeight={props.contentHeight} keys={props.keys} iv={props.iv} />);
          return (<MessageVideo contentUrl={contentDataUrl} fileName={props.fileName} rawMimeType={props.rawMimeType} mimeType={parsedMimeType} fileSize={props.fileSize} contentWidth={props.contentWidth} contentHeight={props.contentHeight} keys={props.keys} iv={props.iv} />);
        case FileType.Audio:
          return (<MessageAudio contentUrl={contentDataUrl} fileName={props.fileName} rawMimeType={props.rawMimeType} mimeType={parsedMimeType} fileSize={props.fileSize} contentWidth={props.contentWidth} contentHeight={props.contentHeight} keys={props.keys} iv={props.iv} />);
        default:
          return (<MessageFile fileName={props.fileName} fileSize={props.fileSize} url={contentDataUrl} content={contentData.current} />);
      }
    }
    return (<MessageFile fileName={props.fileName} fileSize={props.fileSize} url={contentDataUrl} content={contentData.current} />);
  }

  return (
    <div className={classNames} style={{ ...dimensions }} onClick={onMediaClick} onContextMenu={onMediaClick}>
      {mediaElement()}
    </div>
  )
}

export default memo(MessageMedia);
