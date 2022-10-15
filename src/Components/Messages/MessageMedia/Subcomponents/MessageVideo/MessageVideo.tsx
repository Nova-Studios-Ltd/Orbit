import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { MessageMediaProps } from "../../MessageMedia";

export interface MessageVideoProps extends MessageMediaProps {

}

function MessageVideo({ className, contentUrl, fileName, fileSize, mimeType, contentWidth, contentHeight, keys, iv }: MessageVideoProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaVideoContainer", className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <video className="MessageMediaVideo" onClick={(event) => event.preventDefault()} controls src={contentUrl} />
      <div className="MessageMediaVideoOverlay">

      </div>
    </div>
  )
}

export default MessageVideo;
