import { SyntheticEvent, useEffect, useState } from "react";
import { Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import AddFriendsPage from "Views/FriendView/Pages/AddFriendsPage/AddFriendsPage";
import BlockedUsersPage from "./Pages/BlockedUsersPage/BlockedUsersPage";
import FriendPage from "Views/FriendView/Pages/FriendPage/FriendPage";

import type { View } from "Types/UI/Components";
import type { Dictionary } from "NSLib/Dictionary";
import type Friend from "Types/UI/Friend";
import { Routes } from "Types/UI/Routes";
import { useNavigate } from "react-router-dom";

interface FriendViewProps extends View {

}

function FriendView(props: FriendViewProps) {
  const Localizations_FriendView = useTranslation("FriendView").t;
  const classNames = useClassNames("FriendViewContainer", props.className);
  const navigate = useNavigate();

  const onTabChange = (event: SyntheticEvent, value: Routes) => {
    navigate(value);
  }

  const page = () => {
    switch (path) {
      case Routes.FriendsList:
        return (
          <FriendPage friends={props.friends} onReloadList={props.onReloadList} onFriendClicked={props.onFriendClicked} onBlockFriend={props.onBlockFriend} onCreateGroup={props.onCreateGroup} onUnblockFriend={props.onUnblockFriend} onRemoveFriend={props.onRemoveFriend} />
        )
      case Routes.BlockedUsersList:
        return (

        )
      case Routes.AddFriend:
        return (
          <AddFriendsPage onAddFriend={props.onAddFriend} />
        )
      default:
        return null;
    }
  }

  return (
    <ViewContainer className={classNames} noPadding>
      <Tabs variant="scrollable" visibleScrollbar={!props.sharedProps?.isTouchCapable} value={path} onChange={onTabChange}>
        <Tab label={Localizations_FriendView("Tab_Label-FriendsList")} value={Routes.FriendsList} />
        <Tab label={Localizations_FriendView("Tab_Label-BlockedUsers")} value={Routes.BlockedUsersList} />
        <Tab label={Localizations_FriendView("Tab_Label-AddFriend")} value={Routes.AddFriend} />
      </Tabs>
      {page()}
    </ViewContainer>
  );
}

export default FriendView;
