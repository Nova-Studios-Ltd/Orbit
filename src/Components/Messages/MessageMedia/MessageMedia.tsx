import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import type Dimensions from "DataTypes/Dimensions";

export interface MessageMediaProps extends NCComponent {
  content: Uint8Array,
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
      [Media]
    </div>
  )
}

export default MessageMedia;
