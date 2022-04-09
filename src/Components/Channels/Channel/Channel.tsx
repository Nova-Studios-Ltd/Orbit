import { useTheme } from "@mui/material";

import type { NCComponent } from "DataTypes/Components";
import { ChannelType } from "DataTypes/Enums";

export interface ChannelClickEvent {
  channelName?: string,
  channelID?: string,
  channelIconSrc?: string,
  channelMembers?: string[],
  isGroup?: ChannelType,
}

export interface ChannelProps extends NCComponent {
  channelName?: string,
  channelID?: string,
  channelIconSrc?: string,
  channelMembers?: string[],
  isGroup?: ChannelType,
  onClick?: (event: ChannelClickEvent) => void
}

function Channel({ channelName, channelID, channelIconSrc, channelMembers, isGroup, onClick }: ChannelProps) {
  const theme = useTheme();

  const channelClickHandler = () => {
    if (onClick) {
      const channelClickEventProps: ChannelClickEvent = { channelName, channelID, channelIconSrc, channelMembers, isGroup };
      onClick(channelClickEventProps);
    }
  }

  return (
    <div className="ChannelContainer" style={{ backgroundColor: theme.palette.background.paper }} onClick={channelClickHandler}>
      [Channel]
    </div>
  )
}

export default Channel;
