import { useEffect } from "react";
import useClassNames from "Hooks/useClassNames";
import { useTranslation } from "react-i18next";

import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";

import type { View } from "Types/UI/Components";

interface SettingsViewProps extends View {
  avatarNonce?: string,
  onLogout?: () => void,
  onAvatarChanged?: () => void
}

function SettingsView(props: SettingsViewProps) {
  const Localizations_SettingsView = useTranslation("SettingsView").t;
  const classNames = useClassNames("SettingsViewContainer", props.className);

  useEffect(() => {
    if (props.sharedProps && props.sharedProps.changeTitleCallback) props.sharedProps.changeTitleCallback(Localizations_SettingsView("ViewTitle"));
  })

  return (
    <ViewContainer className={classNames} adaptive>
      {props.page}
    </ViewContainer>
  );
}

export default SettingsView;
