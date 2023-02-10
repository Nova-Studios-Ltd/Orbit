import { Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import useClassNames from "Hooks/useClassNames";
import { isSubroute } from "Lib/Utility/Utility";
import { SendFriendRequest } from "Lib/API/Endpoints/Friends";
import UserData from "Lib/Storage/Objects/UserData";

import Channel from "Components/Channels/Channel/Channel";

import { useDispatch, useSelector } from "Redux/Hooks";
import { ChannelLoad, ChannelClearCache, ChannelDelete, ChannelEdit, ChannelMove, ChannelRemoveRecipient, ChannelResetIcon } from "Redux/Thunks/Channels";
import { FriendsPopulate } from "Redux/Thunks/Friends";
import { selectPathname } from "Redux/Selectors/RoutingSelectors";

import type { NCAPIComponent } from "Types/UI/Components";
import type { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import { Routes } from "Types/UI/Routing";
import Friend from "Types/UI/Friend";

export interface ChannelListProps extends NCAPIComponent {

}

function ChannelList(props: ChannelListProps) {
  const Localizations_ChannelList = useTranslation("ChannelList").t;
  const classNames = useClassNames("ChannelListContainer", props.className);
  const theme = useTheme();
  const dispatch = useDispatch();

  const pathname = useSelector(selectPathname());
  const channels = useSelector(state => state.chat.channels);
  const selectedChannel = useSelector(state => state.chat.selectedChannel);

  const onChannelClick = (channel: IRawChannelProps) => {
    dispatch(ChannelLoad(channel));
  }

  const onChannelFriendClicked = (friend: Friend) => {
    if (friend.friendData && friend.friendData.uuid !== UserData.Uuid) {
      SendFriendRequest(friend.friendData.uuid);
    }
  }

  const NoChannelsHint = (
    <div className="NoChannelsHintContainer">
      <Typography variant="h6">{Localizations_ChannelList("Typography_Heading-NoChannelsHint")}</Typography>
      <Typography variant="body1">{Localizations_ChannelList("Typography_Body-NoChannelsHint")}</Typography>
    </div>
  );

  const channelArray = () => {
    if (channels && channels.length > 0) {
      return channels.map((channel, index) => {
        const selected = (channel.table_Id === selectedChannel?.table_Id) && isSubroute(pathname, Routes.Chat);

        /* TODO: Check if channel uuid already has an index stored in localstorage, and use it
          to index the channels in user-specified order (otherwise default to order as retrieved from server)
        */

        return (<Channel key={channel.table_Id} index={index} channelData={channel} selected={selected} onChannelClick={onChannelClick} onChannelClearCache={ChannelClearCache} onChannelDelete={ChannelDelete} onChannelEdit={ChannelEdit} onChannelMove={ChannelMove} onChannelRemoveRecipient={ChannelRemoveRecipient} onChannelResetIcon={ChannelResetIcon} onChannelFriendClicked={onChannelFriendClicked} onReloadList={() => dispatch(FriendsPopulate())} />);
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
