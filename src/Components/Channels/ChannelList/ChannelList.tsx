import { Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import Channel, { ChannelClickEvent } from "Components/Channels/Channel/Channel";

import type { NCComponent } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IChannelProps";

export interface ChannelListProps extends NCComponent {
  channels?: IRawChannelProps[],
  onChannelClick?: (event: ChannelClickEvent) => void
}

function ChannelList({ channels, onChannelClick }: ChannelListProps) {
  const Localizations_ChannelList = useTranslation("ChannelList").t;
  const theme = useTheme();

  const NoChannelsHint = (
    <div className="NoChannelsHintContainer">
      <Typography variant="h6">{Localizations_ChannelList("Typography_Heading-NoChannelsHint")}</Typography>
      <Typography variant="body1">{Localizations_ChannelList("Typography_Body-NoChannelsHint")}</Typography>
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
