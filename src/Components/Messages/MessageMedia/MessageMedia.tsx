import { useTheme } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import useClassNames from "Hooks/useClassNames";
import { ComputeCSSDims } from "NSLib/Util";
import Dimensions from "DataTypes/Dimensions";
import MimeTypeParser, { FileType } from "NSLib/MimeTypeParser";

import MessageFile from "./Subcomponents/MessageFile/MessageFile";
import MessageImage from "./Subcomponents/MessageImage/MessageImage";
import MessageVideo from "./Subcomponents/MessageVideo/MessageVideo";
import MessageAudio from "./Subcomponents/MessageAudio/MessageAudio";

import type { NCComponent } from "DataTypes/Components";

export interface MessageMediaProps extends NCComponent {
  content?: Uint8Array,
  contentUrl?: string,
  fileName?: string,
  fileSize?: number,
  mimeType?: string,
  contentWidth?: number,
  contentHeight?: number
}

function MessageMedia({ className, content, contentUrl, fileName, mimeType, fileSize, contentWidth, contentHeight }: MessageMediaProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaContainer", className);
  const isPreviewableMediaType = useRef(false);
  const [dimensions, setDimensions] = useState({});

  useEffect(() => {
    let _dimensions = {};
    if (contentWidth && contentHeight) {
      const size = ComputeCSSDims(new Dimensions(contentWidth, contentHeight), new Dimensions(575, 400));
      _dimensions = { width: size.width > 0 ? size.width : "18rem", height: size.height > 0 ? size.height : "30rem" };
    }

    if (isPreviewableMediaType.current) {
      setDimensions(_dimensions);
    }

  }, [contentHeight, contentWidth, isPreviewableMediaType]);

  const mediaElement = () => {
    if (mimeType && mimeType.length > 0) {
      const parsedMimeType = new MimeTypeParser(mimeType).getGeneralizedFileType();
      switch (parsedMimeType) {
        case FileType.Image:
          isPreviewableMediaType.current = true;
          return (<MessageImage content={content} contentUrl={contentUrl} fileName={fileName} mimeType={mimeType} fileSize={fileSize} contentWidth={contentWidth} contentHeight={contentHeight} />);
        case FileType.Video:
          isPreviewableMediaType.current = true;
          return (<MessageVideo content={content} contentUrl={contentUrl} fileName={fileName} mimeType={mimeType} fileSize={fileSize} contentWidth={contentWidth} contentHeight={contentHeight} />);
        case FileType.Audio:
          return (<MessageAudio content={content} contentUrl={contentUrl} fileName={fileName} mimeType={mimeType} fileSize={fileSize} contentWidth={contentWidth} contentHeight={contentHeight} />);
        default:
          return (<MessageFile fileName={fileName} fileSize={fileSize} content={content} url={contentUrl} />);
      }
    }
    return (<MessageFile fileName={fileName} fileSize={fileSize} content={content} url={contentUrl} />);
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper, ...dimensions }}>
      {mediaElement()}
    </div>
  )
}

export default memo(MessageMedia);
