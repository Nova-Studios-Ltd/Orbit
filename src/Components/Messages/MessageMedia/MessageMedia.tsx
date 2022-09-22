import React, { createContext, memo, useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { ComputeCSSDims } from "NSLib/Util";
import Dimensions from "Types/Dimensions";
import MimeTypeParser, { FileType } from "NSLib/MimeTypeParser";

import MessageFile from "./Subcomponents/MessageFile/MessageFile";
import MessageImage from "./Subcomponents/MessageImage/MessageImage";
import MessageVideo from "./Subcomponents/MessageVideo/MessageVideo";
import MessageAudio from "./Subcomponents/MessageAudio/MessageAudio";

import type { NCComponent, SharedProps } from "Types/UI/Components";
import type { IAttachmentProps } from "Types/API/Interfaces/IAttachmentProps";

export interface MessageMediaProps extends NCComponent {
  content?: Uint8Array,
  contentUrl?: string,
  fileName?: string,
  fileSize?: number,
  mimeType?: string,
  contentWidth?: number,
  contentHeight?: number,
  isExternal?: boolean,
  onLeftClick?: (event: React.MouseEvent<HTMLDivElement>, attachment: IAttachmentProps) => void,
  onRightClick?: (event: React.MouseEvent<HTMLDivElement>, attachment: IAttachmentProps) => void
}

function MessageMedia(props: MessageMediaProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaContainer", props.className);
  const isPreviewableMediaType = useRef(false);
  const [dimensions, setDimensions] = useState({});

  const SharedPropsContext = createContext({} as SharedProps);

  const onMediaClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const attachmentProps = { contentUrl: props.contentUrl || "", content: props.content || new Uint8Array(), filename: props.fileName || "", mimeType: props.mimeType || "", size: props.fileSize || 0, contentWidth: props.contentWidth || 0, contentHeight: props.contentHeight || 0, keys: {}, iv: "", isExternal: props.isExternal || false };

    if (event.button === 0) { // Left Click
      if (props.onLeftClick) props.onLeftClick(event, attachmentProps);

    }
    else if (event.button === 2) { // Right Click
      if (props.onRightClick) props.onRightClick(event, attachmentProps);
    }
  }

  const mediaElement = () => {
    if (props.mimeType && props.mimeType.length > 0) {
      const parsedMimeType = new MimeTypeParser(props.mimeType).getGeneralizedFileType();
      switch (parsedMimeType) {
        case FileType.Image:
          isPreviewableMediaType.current = true;
          if (props.isExternal) return (<MessageImage contentUrl={props.contentUrl} fileName={props.fileName} mimeType={props.mimeType} fileSize={props.fileSize} contentWidth={props.contentWidth} contentHeight={props.contentHeight} />);
          return (<MessageImage content={props.content} contentUrl={props.contentUrl} fileName={props.fileName} mimeType={props.mimeType} fileSize={props.fileSize} contentWidth={props.contentWidth} contentHeight={props.contentHeight} />);
        case FileType.Video:
          isPreviewableMediaType.current = true;
          if (props.isExternal) return (<MessageVideo contentUrl={props.contentUrl} fileName={props.fileName} mimeType={props.mimeType} fileSize={props.fileSize} contentWidth={props.contentWidth} contentHeight={props.contentHeight} />);
          return (<MessageVideo content={props.content} contentUrl={props.contentUrl} fileName={props.fileName} mimeType={props.mimeType} fileSize={props.fileSize} contentWidth={props.contentWidth} contentHeight={props.contentHeight} />);
        case FileType.Audio:
          return (<MessageAudio content={props.content} contentUrl={props.contentUrl} fileName={props.fileName} mimeType={props.mimeType} fileSize={props.fileSize} contentWidth={props.contentWidth} contentHeight={props.contentHeight} />);
        default:
          return (<MessageFile fileName={props.fileName} fileSize={props.fileSize} content={props.content} url={props.contentUrl} />);
      }
    }
    return (<MessageFile fileName={props.fileName} fileSize={props.fileSize} content={props.content} url={props.contentUrl} />);
  }

  return (
    <SharedPropsContext.Consumer>
      {
        sharedProps => {

          let _dimensions = {};

          if (props.contentWidth && props.contentHeight) {
            const size = ComputeCSSDims(new Dimensions(props.contentWidth, props.contentHeight), new Dimensions(575, 400));
            _dimensions = sharedProps?.widthConstrained ? { width: "100%", height: "auto" } : { width: size.width > 0 ? size.width : "18rem", height: size.height > 0 ? size.height : "30rem" };
          }

          if (isPreviewableMediaType.current) {
            setDimensions(_dimensions);
          }

          return (
            <div className={classNames} style={{ backgroundColor: theme.palette.background.paper, ...dimensions }} onClick={onMediaClick} onContextMenu={onMediaClick}>
              {mediaElement()}
            </div>
          );
        }
      }
    </SharedPropsContext.Consumer>
  )
}

export default memo(MessageMedia);
