import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import useClassNames from "Hooks/useClassNames";

import FriendPage from "Views/FriendView/Pages/FriendPage/FriendPage";

import type { View } from "DataTypes/Components";
import { SettingsViewRoutes } from "DataTypes/Routes";

interface SettingsViewProps extends View {
  path: SettingsViewRoutes
}

function SettingsView(props: SettingsViewProps) {
  const classNames = useClassNames("SettingsViewContainer", props.className);

  const page = () => {
    switch (props.path) {
      case SettingsViewRoutes.Dashboard:
        return <FriendPage />
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
