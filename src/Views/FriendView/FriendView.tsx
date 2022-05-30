import { SyntheticEvent, useState } from "react";
import { Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { FriendViewRoutes } from "DataTypes/Routes";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import AddFriendsPage from "Views/FriendView/Pages/AddFriendsPage/AddFriendsPage";
import FriendPage from "Views/FriendView/Pages/FriendPage/FriendPage";

import type { View } from "DataTypes/Components";

interface FriendViewProps extends View {
  path?: never,
  onChannelCreate?: (recipient: string) => void
}

function FriendView(props: FriendViewProps) {
  const classNames = useClassNames("FriendViewContainer", props.className);

  const [path, setPath] = useState(FriendViewRoutes.FriendsList);

  const onTabChange = (event: SyntheticEvent, value: FriendViewRoutes) => {
    setPath(value);
  }

  const page = () => {
    switch (path) {
      case FriendViewRoutes.FriendsList:
        return (
          <FriendPage />
        )
      case FriendViewRoutes.AddFriend:
        return (
          <AddFriendsPage onChannelCreate={props.onChannelCreate} />
        )
      default:
        return null;
    }
  }

  return (
    <ViewContainer className={classNames} noPadding>
      <Tabs value={path} onChange={onTabChange}>
        <Tab label="[Friends List]" value={FriendViewRoutes.FriendsList} />
        <Tab label="[Add Friend]" value={FriendViewRoutes.AddFriend} />
      </Tabs>
      {page()}
    </ViewContainer>
  );
}

export default FriendView;
