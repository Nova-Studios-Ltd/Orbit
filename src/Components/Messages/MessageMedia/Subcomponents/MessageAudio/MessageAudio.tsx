import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { MessageMediaProps } from "../../MessageMedia";

export interface MessageAudioProps extends MessageMediaProps {

}

function MessageAudio({ className, contentUrl, fileName, fileSize, mimeType, contentWidth, contentHeight, keys, iv }: MessageAudioProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaAudioContainer", className);

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <audio className="MessageMediaAudio" controls src={contentUrl} />
      <div className="MessageMediaAudioOverlay">

      </div>
    </div>
  )
}

export default MessageAudio;
