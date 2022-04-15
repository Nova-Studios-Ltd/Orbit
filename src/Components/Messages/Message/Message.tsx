import { Avatar, Typography, useTheme } from "@mui/material";

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
    <div className="MessageContainer" style={{ backgroundColor: "transparent" }}>
      <div className="MessageLeft">
        <Avatar src={`${avatarURL}&${Date.now()}`} />
      </div>
      <div className="MessageRight" style={{ backgroundColor: theme.customPalette.messageBackground }}>
        <div className="MessageRightHeader">
          <Typography className="MessageName" fontWeight="bold">{author}</Typography>
          <Typography className="MessageTimestamp" variant="subtitle2">{timestamp}</Typography>
        </div>
        {content}
      </div>
    </div>
  )
}

export default Message;
