import { useTheme } from "@mui/material";
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

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <img src={(content !== undefined)? URL.createObjectURL(new Blob([content])): "https://www.akc.org/wp-content/uploads/2018/05/samoyed-mother-dog-with-puppy-outdoors.jpg"} alt={filename} />
      <img className="MessageMediaImage" src={contentUrl} alt={filename} />
    </div>
  )
}

export default MessageMedia;
