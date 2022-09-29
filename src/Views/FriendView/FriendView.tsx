import { Tab, Tabs } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";

import type { View } from "Types/UI/Components";
import type { SyntheticEvent } from "react";
import { Routes } from "Types/UI/Routes";

interface FriendViewProps extends View {

}

function FriendView(props: FriendViewProps) {
  const Localizations_FriendView = useTranslation("FriendView").t;
  const classNames = useClassNames("FriendViewContainer", props.className);
  const location = useLocation();
  const navigate = useNavigate();

  const onTabChange = (event: SyntheticEvent, value: Routes) => {
    navigate(value);
  }

  return (
    <ViewContainer className={classNames} noPadding>
      <Tabs variant="scrollable" visibleScrollbar={!props.sharedProps?.isTouchCapable} value={location.pathname} onChange={onTabChange}>
        <Tab label={Localizations_FriendView("Tab_Label-FriendsList")} value={Routes.FriendsList} />
        <Tab label={Localizations_FriendView("Tab_Label-BlockedUsers")} value={Routes.BlockedUsersList} />
        <Tab label={Localizations_FriendView("Tab_Label-AddFriend")} value={Routes.AddFriend} />
      </Tabs>
      <Outlet />
    </ViewContainer>
  );
}

export default FriendView;
