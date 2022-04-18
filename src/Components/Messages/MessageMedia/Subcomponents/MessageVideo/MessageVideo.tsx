import { Icon, Typography, IconButton, useTheme } from "@mui/material";
import { DownloadUint8ArrayFile } from "NSLib/ElectronAPI";
import { Download as DownloadIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";
import type { MessageMediaProps } from "../../MessageMedia";

export interface MessageVideoProps extends MessageMediaProps {
  contentRef: React.MutableRefObject<string>
}

function MessageVideo({ className, contentRef, content, contentUrl, fileName, fileSize, mimeType, contentWidth, contentHeight }: MessageVideoProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageMediaVideoContainer", className);

  const download = () => {
    if (content) {
      DownloadUint8ArrayFile(content, fileName);
      return;
    }
    console.warn("File does not contain content to download");
  };

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <video className="MessageMediaVideo" src={contentRef.current} />
    </div>
  )
}

export default MessageVideo;
