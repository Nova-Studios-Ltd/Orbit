import { useTheme } from "@mui/material";
import TimeBar from "Components/MediaPlayer/TimeBar/TimeBar";
import useClassNames from "Hooks/useClassNames";

import type { MessageMediaProps } from "../../MessageMedia";

export interface MessageAudioProps extends MessageMediaProps {

}

function MessageAudio({ className, contentUrl, fileName, fileSize, mimeType, contentWidth, contentHeight, keys, iv }: MessageAudioProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaAudioContainer", className);

  return (
    <div className={classNames}>
      <audio className="MessageMediaAudio" controls src={contentUrl} />
      <TimeBar duration={10} curTime={2} onTimeUpdate={() => {}}></TimeBar>
      <div className="MessageMediaAudioOverlay">

      </div>
    </div>
  )
}

export default MessageAudio;
