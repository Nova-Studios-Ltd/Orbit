import { Icon, Typography, IconButton, useTheme } from "@mui/material";
import { DownloadUint8ArrayFile } from "NSLib/ElectronAPI";
import { Download as DownloadIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import type { NCComponent } from "DataTypes/Components";

export interface MessageFileProps extends NCComponent {
  fileName?: string,
  fileSize?: number,
  content?: Uint8Array,
  url?: string
}

function MessageFile({ className, fileName, fileSize, content, url }: MessageFileProps) {
  const Localizations_MessageFile = useTranslation("MessageFile").t;
  const theme = useTheme();
  const classNames = useClassNames("MessageFileContainer", className);

  const download = () => {
    if (content) {
      DownloadUint8ArrayFile(content, fileName);
      return;
    }
    console.warn("File does not contain content to download");
  };

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <div className='MessageFileContainerLeft'>
        <Icon className='MessageFileContainerIcon'>
          <FileIcon />
        </Icon>
      </div>
      <div className='MessageFileContainerRight'>
        <div className='MessageFileContainerTextSection'>
          <Typography variant='subtitle1'>{fileName}</Typography>
          <Typography variant='caption'>{fileSize} {Localizations_MessageFile("Typography-UnitsByte")}</Typography>
        </div>
        <IconButton className='MessageFileContainerDownloadButton' onClick={download}><DownloadIcon /></IconButton>
      </div>
    </div>
  )
}

export default MessageFile;
