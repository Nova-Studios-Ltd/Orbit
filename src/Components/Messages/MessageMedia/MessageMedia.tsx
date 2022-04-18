import { useTheme } from "@mui/material";
import { useRef } from "react";
import useClassNames from "Hooks/useClassNames";

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

  if (content) {
    contentRef.current = URL.createObjectURL(new Blob([content]));
  } else if ( contentUrl) {
    contentRef.current = contentUrl;
  }

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <img className="MessageMediaImage" src={contentRef.current} alt={filename} />
    </div>
  )
}

export default MessageMedia;
