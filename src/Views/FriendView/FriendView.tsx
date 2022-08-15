import { SyntheticEvent, useEffect, useState } from "react";
import { Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import AddFriendsPage from "Views/FriendView/Pages/AddFriendsPage/AddFriendsPage";
import BlockedUsersPage from "./Pages/BlockedUsersPage/BlockedUsersPage";
import FriendPage from "Views/FriendView/Pages/FriendPage/FriendPage";

import type { View } from "DataTypes/Components";
import type { Dictionary } from "NSLib/Dictionary";
import type Friend from "DataTypes/Friend";
import { FriendViewRoutes } from "DataTypes/Routes";

interface FriendViewProps extends View {
  path?: never,
  friends?: Friend[],
  onReloadList?: () => void,
  onFriendClicked?: (friend: Friend) => void,
  onAddFriend?: (recipient: string) => void,
  onRemoveFriend?: (uuid: string) => void,
  onBlockFriend?: (uuid: string) => void,
  onUnblockFriend?: (uuid: string) => void
}

function FriendView(props: FriendViewProps) {
  const Localizations_FriendView = useTranslation("FriendView").t;
  const classNames = useClassNames("FriendViewContainer", props.className);

  const [path, setPath] = useState(FriendViewRoutes.FriendsList);

  const onTabChange = (event: SyntheticEvent, value: FriendViewRoutes) => {
    setPath(value);
  }

  const page = () => {
    switch (path) {
      case FriendViewRoutes.FriendsList:
        return (
          <FriendPage friends={props.friends} onReloadList={props.onReloadList} onFriendClicked={props.onFriendClicked} onBlockFriend={props.onBlockFriend} onUnblockFriend={props.onUnblockFriend} onRemoveFriend={props.onRemoveFriend} sharedProps={props.sharedProps} />
        )
      case FriendViewRoutes.BlockedUsersList:
        return (
          <BlockedUsersPage sharedProps={props.sharedProps} friends={props.friends} onReloadList={props.onReloadList} onUnblockFriend={props.onUnblockFriend} />
        )
      case FriendViewRoutes.AddFriend:
        return (
          <AddFriendsPage sharedProps={props.sharedProps} onAddFriend={props.onAddFriend} />
        )
      default:
        return null;
    }
  }

  return (
    <ViewContainer className={classNames} noPadding>
      <Tabs variant="scrollable" visibleScrollbar={!props.sharedProps?.isTouchCapable} value={path} onChange={onTabChange}>
        <Tab label={Localizations_FriendView("Tab_Label-FriendsList")} value={FriendViewRoutes.FriendsList} />
        <Tab label={Localizations_FriendView("Tab_Label-BlockedUsers")} value={FriendViewRoutes.BlockedUsersList} />
        <Tab label={Localizations_FriendView("Tab_Label-AddFriend")} value={FriendViewRoutes.AddFriend} />
      </Tabs>
      {page()}
    </ViewContainer>
  );
}

export default FriendView;
