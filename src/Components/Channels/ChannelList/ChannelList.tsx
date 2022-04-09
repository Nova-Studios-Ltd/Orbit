import { useTheme } from "@mui/material";

import Channel, { ChannelClickEvent } from "Components/Channels/Channel/Channel";

import type { NCComponent } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IChannelProps";

export interface ChannelListProps extends NCComponent {
  channels?: IRawChannelProps[],
  onChannelClick?: (event: ChannelClickEvent) => void
}

function ChannelList({ channels, onChannelClick }: ChannelListProps) {
  const theme = useTheme();

  const NoChannelsHint = (
    <div>
      [No Channels]
    </div>
  );

  const channelArray = () => {
    if (channels && channels.length > 0) {
      return channels.map((channel) => {
        return (<Channel channelName={channel.channelName} channelID={channel.owner_UUID} channelIconSrc={channel.channelIcon} channelMembers={channel.members} isGroup={channel.channelType} onClick={onChannelClick} />);
      });
    }

    return NoChannelsHint;
  };

  return (
    <div className="ChannelListContainer" style={{ backgroundColor: theme.palette.background.paper }}>
      {channelArray()}
    </div>
  )
}

export default ChannelList;
