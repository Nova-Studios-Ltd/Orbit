import { Avatar, IconButton, Typography, useTheme } from "@mui/material";

import type { NCComponent } from "DataTypes/Components";

export interface MessageProps extends NCComponent {
  content?: string,
  avatarURL?: string,
  author?: string,
  timestamp?: string
}

function Message({ content, avatarURL, author, timestamp }: MessageProps) {
  const theme = useTheme();

  return (
    <div className="MessageContainer" style={{ backgroundColor: theme.palette.background.paper }}>
      <div className="Message_Left">
          <Avatar src={`${avatarURL}&${Date.now()}`} />
        </div>
        <div className="Message_Right">
          <div className="Message_Right_Header">
            <Typography className="Message_Name" fontWeight="bold">{author}</Typography>
            <Typography className="Message_Timestamp" variant="subtitle2">{timestamp}</Typography>
          </div>
          {content}
        </div>
    </div>
  )
}

export default Message;
