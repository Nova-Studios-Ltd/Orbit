import { Typography, useTheme } from "@mui/material";
import useClassNames from "Hooks/useClassNames";

import type { NCAPIComponent } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import AvatarTextButton from "Components/Buttons/AvatarTextButton/AvatarTextButton";

export interface MessageCanvasHeaderProps extends NCAPIComponent {

}

function MessageCanvasHeader({ className, selectedChannel }: MessageCanvasHeaderProps) {
  const theme = useTheme();
  const classNames = useClassNames("MessageCanvasHeaderContainer", className);

  if (!selectedChannel) return null;

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      <Typography variant="h5">{selectedChannel?.channelName}</Typography>
    </div>
  )
}

export default MessageCanvasHeader;
