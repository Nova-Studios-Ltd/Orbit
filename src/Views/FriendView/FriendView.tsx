import { Tab, Tabs } from "@mui/material";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";

import { useDispatch, useSelector } from "Redux/Hooks";
import { navigate } from "Redux/Thunks/Routing";
import { selectPathname } from "Redux/Selectors/RoutingSelectors";

import type { View } from "Types/UI/Components";
import type { SyntheticEvent } from "react";
import { Routes } from "Types/UI/Routing";

interface FriendViewProps extends View {

}

function FriendView(props: FriendViewProps) {
  const Localizations_FriendView = useTranslation("FriendView").t;
  const classNames = useClassNames("FriendViewContainer", props.className);
  const dispatch = useDispatch();

  const pathname = useSelector(selectPathname());
  const isTouchCapable = useSelector(state => state.app.isTouchCapable);

  const onTabChange = (event: SyntheticEvent, value: string) => {
    dispatch(navigate({ pathname: value }));
  }

  return (
    <ViewContainer className={classNames} noPadding>
      <Tabs variant="scrollable" visibleScrollbar={isTouchCapable} value={pathname} onChange={onTabChange}>
        <Tab label={Localizations_FriendView("Tab_Label-FriendsList")} value={Routes.FriendsList} />
        <Tab label={Localizations_FriendView("Tab_Label-BlockedUsers")} value={Routes.BlockedUsersList} />
        <Tab label={Localizations_FriendView("Tab_Label-AddFriend")} value={Routes.AddFriend} />
      </Tabs>
      <Outlet />
    </ViewContainer>
  );
}

export default FriendView;
