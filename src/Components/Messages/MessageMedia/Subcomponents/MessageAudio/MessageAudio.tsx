import { Icon, Typography, IconButton, useTheme } from "@mui/material";
import { DownloadUint8ArrayFile } from "NSLib/ElectronAPI";
import { Download as DownloadIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';
import useClassNames from "Hooks/useClassNames";
import useContentRef from "Hooks/useContentRef";

import type { NCComponent } from "DataTypes/Components";
import type { MessageMediaProps } from "../../MessageMedia";

export interface MessageAudioProps extends MessageMediaProps {

}

function MessageAudio({ className, content, contentUrl, fileName, fileSize, mimeType, contentWidth, contentHeight }: MessageAudioProps) {
  const theme = useTheme();
  const contentRef = useContentRef(content, contentUrl);
  const classNames = useClassNames("MessageMediaAudioContainer", className);

  const download = () => {
    if (content) {
      DownloadUint8ArrayFile(content, fileName);
      return;
    }
    console.warn("File does not contain content to download");
  };

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <audio className="MessageMediaAudio" controls src={contentRef.current} />
      <div className="MessageMediaAudioOverlay">

      </div>
    </div>
  )
}

export default MessageAudio;
