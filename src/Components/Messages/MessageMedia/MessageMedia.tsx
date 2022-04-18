import { useTheme } from "@mui/material";
import { useRef } from "react";
import useClassNames from "Hooks/useClassNames";
import { ComputeCSSDims } from "NSLib/Util";
import Dimensions from "DataTypes/Dimensions";

import type { NCComponent } from "DataTypes/Components";

export interface MessageMediaProps extends NCComponent {
  content?: Uint8Array,
  contentUrl?: string,
  filename?: string,
  size?: number,
  contentWidth?: number,
  contentHeight?: number
}

function MessageMedia({ className, content, contentUrl, filename, size, contentWidth, contentHeight }: MessageMediaProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaContainer", className);
  const contentRef = useRef("");
  let dimensions = {}

  if (content) {
    contentRef.current = URL.createObjectURL(new Blob([content]));
  } else if ( contentUrl) {
    contentRef.current = contentUrl;
  }

  if (contentWidth !== undefined && contentHeight !== undefined) {
    const size = ComputeCSSDims(new Dimensions(contentWidth, contentHeight), new Dimensions(575, 400));
    dimensions = { width: size.width > 0 ? size.width : "18rem", height: size.height > 0 ? size.height : "30rem" };
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper, ...dimensions }}>
      <img className="MessageMediaImage" src={contentRef.current} alt={filename} />
    </div>
  )
}

export default MessageMedia;
