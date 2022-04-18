import { useTheme } from "@mui/material";
import { useRef } from "react";
import useClassNames from "Hooks/useClassNames";
import { ComputeCSSDims } from "NSLib/Util";
import Dimensions from "DataTypes/Dimensions";

import MessageFile from "./Subcomponents/MessageFile/MessageFile";
import MessageImage from "./Subcomponents/MessageImage/MessageImage";
import MessageVideo from "./Subcomponents/MessageVideo/MessageVideo";

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
  const contentRef = useRef("");
  const isMedia = false; // Add check to see if mimetype matches valid media (image, video)
  let dimensions = {};

  if (content) {
    contentRef.current = URL.createObjectURL(new Blob([content]));
  } else if (contentUrl) {
    contentRef.current = contentUrl;
  }

  if (contentWidth && contentHeight && isMedia) {
    const size = ComputeCSSDims(new Dimensions(contentWidth, contentHeight), new Dimensions(575, 400));
    dimensions = { width: size.width > 0 ? size.width : "18rem", height: size.height > 0 ? size.height : "30rem" };
  }

  const mediaElement = () => {
    if (mimeType && mimeType.length > 0) {
      switch (mimeType) {
        case "image": // TODO: Change this to actually match image mime type
          return (<MessageImage contentRef={contentRef} content={content} contentUrl={contentUrl} fileName={fileName} mimeType={mimeType} fileSize={fileSize} contentWidth={contentWidth} contentHeight={contentHeight} />);
        case "video": // TODO: Change this to actually match video mime type
          return (<MessageVideo contentRef={contentRef} content={content} contentUrl={contentUrl} fileName={fileName} mimeType={mimeType} fileSize={fileSize} contentWidth={contentWidth} contentHeight={contentHeight} />);
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

export default MessageMedia;
