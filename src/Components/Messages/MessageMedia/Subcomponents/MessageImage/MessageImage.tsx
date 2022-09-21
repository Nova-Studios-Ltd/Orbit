import { Icon, Typography, IconButton, useTheme } from "@mui/material";
import { DownloadUint8ArrayFile } from "NSLib/ElectronAPI";
import { Download as DownloadIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';
import useClassNames from "Hooks/useClassNames";
import useContentRef from "Hooks/useContentRef";

import type { NCComponent } from "Types/UI/Components";
import type { MessageMediaProps } from "../../MessageMedia";

export interface MessageImageProps extends MessageMediaProps {

}

function MessageImage({ className, content, contentUrl, fileName, fileSize, mimeType, contentWidth, contentHeight }: MessageImageProps) {
  const theme = useTheme();
  const contentRef = useContentRef(content, contentUrl);
  const classNames = useClassNames("MessageMediaImageContainer", className);

  const download = () => {
    if (content) {
      DownloadUint8ArrayFile(content, fileName);
      return;
    }
    console.warn("File does not contain content to download");
  };

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <img className="MessageMediaImage" onClick={(event) => event.preventDefault()} src={contentRef.current} alt={fileName} loading="lazy"/>
      <div className="MessageMediaImageOverlay">

      </div>
    </div>
  )
}

export default MessageImage;
