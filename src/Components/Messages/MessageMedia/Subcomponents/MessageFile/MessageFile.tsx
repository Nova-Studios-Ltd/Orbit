import { Icon, Typography, IconButton } from "@mui/material";
import { Download as DownloadIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';
import { useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCComponent } from "DataTypes/Components";

export interface ComponentProps extends NCComponent {
  filename?: string,
  filesize?: number,
  content?: Uint8Array,
  url?: string
}

function MessageFile({ className, filename, filesize, content, url }: ComponentProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageFileContainer", className);

  const download = () => {

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
          <Typography variant='subtitle1'>{filename}</Typography>
          <Typography variant='caption'>{filesize} bytes</Typography>
        </div>
        <IconButton className='MessageFileContainerDownloadButton' onClick={download}><DownloadIcon /></IconButton>
      </div>
    </div>
  )
}

export default MessageFile;
