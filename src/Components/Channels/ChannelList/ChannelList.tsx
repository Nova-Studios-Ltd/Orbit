import { Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import useClassNames from "Hooks/useClassNames";

import Channel, { ChannelProps } from "Components/Channels/Channel/Channel";

import type { NCAPIComponent } from "DataTypes/Components";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";

export interface ChannelListProps extends NCAPIComponent {
  channels?: IRawChannelProps[],
  onChannelClearCache?: (channel: IRawChannelProps) => void,
  onChannelClick?: (channel: IRawChannelProps) => void,
  onChannelDelete?: (channel: IRawChannelProps) => void,
  onChannelEdit?: (channel: IRawChannelProps) => void,
  onChannelMove?: (currentChannel: IRawChannelProps, otherChannel: IRawChannelProps, index: number) => void,
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
      return props.channels.map((channel, index) => {
        const isSelected = channel.table_Id === props.selectedChannel?.table_Id;

        /* TODO: Check if channel uuid already has an index stored in localstorage, and use it
          to index the channels in user-specified order (otherwise default to order as retrieved from server)
        */

        return (<Channel key={channel.table_Id} index={index} sharedProps={props.sharedProps} channelData={channel} isSelected={isSelected} isGroup={channel.isGroup} onChannelClearCache={props.onChannelClearCache} onChannelClick={props.onChannelClick} onChannelDelete={props.onChannelDelete} onChannelEdit={props.onChannelEdit} onChannelMove={props.onChannelMove} />);
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
