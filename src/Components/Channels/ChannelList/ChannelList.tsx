import { Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import useClassNames from "Hooks/useClassNames";

import Channel, { ChannelProps } from "Components/Channels/Channel/Channel";

import type { NCAPIComponent } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";

export interface ChannelListProps extends NCAPIComponent {
  channels?: IRawChannelProps[],
  onChannelEdit?: (channel: IRawChannelProps) => void,
  onChannelDelete?: (channel: IRawChannelProps) => void,
  onChannelClick?: (channel: IRawChannelProps) => void
}

function ChannelList(props: ChannelListProps) {
  const Localizations_ChannelList = useTranslation("ChannelList").t;
  const classNames = useClassNames("ChannelListContainer", props.className);
  const theme = useTheme();

  const NoChannelsHint = (
    <div className="NoChannelsHintContainer">
      <Typography variant="h6">{Localizations_ChannelList("Typography_Heading-NoChannelsHint")}</Typography>
      <Typography variant="body1">{Localizations_ChannelList("Typography_Body-NoChannelsHint")}</Typography>
    </div>
  );

  const channelArray = () => {
    if (props.channels && props.channels.length > 0) {
      return props.channels.map((channel) => {
        const isSelected = channel.table_Id === props.selectedChannel?.table_Id;
        return (<Channel key={channel.table_Id} sharedProps={props.sharedProps} channelData={channel} isSelected={isSelected} isGroup={channel.isGroup} onChannelEdit={props.onChannelEdit} onChannelDelete={props.onChannelDelete} onClick={props.onChannelClick} />);
      });
    }

    return NoChannelsHint;
  };

  return (
    <div className={classNames} style={{ backgroundColor: theme.palette.background.paper }}>
      {channelArray()}
    </div>
  )
}

export default ChannelList;
