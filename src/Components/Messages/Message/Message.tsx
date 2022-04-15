import { Avatar, Typography, useTheme } from "@mui/material";

import type { NCComponent } from "DataTypes/Components";
import { useState } from "react";

export interface MessageProps extends NCComponent {
  content?: string,
  avatarURL?: string,
  author?: string,
  timestamp?: string
}

function Message({ content, avatarURL, author, timestamp }: MessageProps) {
  const theme = useTheme();
  const [isHovering, setHoveringState] = useState(false);

  const mouseHoverEventHandler = (isHovering: boolean) => {
    setHoveringState(isHovering);
  }

  return (
    <div className="MessageContainer" style={{ backgroundColor: "transparent" }}>
      <div className="MessageLeft">
        <Avatar src={`${avatarURL}`} />
      </div>
      <div className="MessageRight" style={{ backgroundColor: isHovering ? theme.customPalette.customActions.messageHover : theme.customPalette.messageBackground }} onMouseEnter={() => mouseHoverEventHandler(true)} onMouseLeave={() => mouseHoverEventHandler(false)}>
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
