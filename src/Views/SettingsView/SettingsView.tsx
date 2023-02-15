import { SyntheticEvent } from "react";
import { Outlet } from "react-router-dom";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "Redux/Hooks";
import { navigate } from "Redux/Thunks/Routing";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";

import type { View } from "Types/UI/Components";
import { Tab, Tabs } from "@mui/material";
import { Routes } from "Types/UI/Routing";

interface SettingsViewProps extends View {
  avatarNonce?: string,
  onLogout?: () => void,
  onAvatarChanged?: () => void
}

function SettingsView(props: SettingsViewProps) {
  const Localizations_SettingsView = useTranslation("SettingsView").t;
  const classNames = useClassNames("SettingsViewContainer", props.className);
  const dispatch = useDispatch();

  const pathname = useSelector(state => state.routing.pathname);
  const isTouchCapable = useSelector(state => state.app.isTouchCapable);

  const onTabChange = (event: SyntheticEvent, value: string) => {
    dispatch(navigate({ pathname: value }));
  }

  return (
    <ViewContainer className={classNames} adaptive>
      <Tabs variant="scrollable" visibleScrollbar={isTouchCapable} value={pathname} onChange={onTabChange}>
        <Tab label={Localizations_SettingsView("Tab_Label-Dashboard")} value={Routes.Dashboard} />
        <Tab label={Localizations_SettingsView("Tab_Label-Debug")} value={Routes.Debug} />
      </Tabs>
      <Outlet />
    </ViewContainer>
  );
}

export default SettingsView;
