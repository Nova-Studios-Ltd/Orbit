import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { MessageMediaProps } from "../../MessageMedia";

export interface MessageImageProps extends MessageMediaProps {

}

function MessageImage({ className, contentUrl, fileName, fileSize, mimeType, contentWidth, contentHeight, keys, iv }: MessageImageProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaImageContainer", className);

  return (
    <div className={classNames}>
      <img className="MessageMediaImage" width={contentWidth} height={contentHeight} onClick={(event) => event.preventDefault()} src={contentUrl} alt={fileName} loading="lazy"/>
      <div className="MessageMediaImageOverlay">

      </div>
    </div>
  )
}

export default MessageImage;
