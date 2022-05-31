import { useEffect } from "react";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import DashboardPage from "Views/SettingsView/Pages/DashboardPage/DashboardPage";

import type { View } from "DataTypes/Components";
import { SettingsViewRoutes } from "DataTypes/Routes";

interface SettingsViewProps extends View {
  path: SettingsViewRoutes,
  avatarNonce?: string,
  onLogout?: () => void,
  onAvatarChanged?: () => void
}

function SettingsView(props: SettingsViewProps) {
  const Localizations_SettingsView = useTranslation("SettingsView").t;
  const classNames = useClassNames("SettingsViewContainer", props.className);

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_SettingsView("ViewTitle"));
  }, [Localizations_SettingsView, props, props.sharedProps?.changeTitleCallback]);

  const page = () => {
    switch (props.path) {
      case SettingsViewRoutes.Dashboard:
        return <DashboardPage avatarNonce={props.avatarNonce} onAvatarChanged={props.onAvatarChanged} onLogout={props.onLogout} />
      default:
        return null;
    }
  }

  return (
    <ViewContainer className={classNames} noPadding>
      {page()}
    </ViewContainer>
  );
}

export default SettingsView;
