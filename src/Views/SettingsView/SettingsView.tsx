import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import useClassNames from "Hooks/useClassNames";

import DashboardPage from "Views/SettingsView/Pages/DashboardPage/DashboardPage";

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
        return <DashboardPage />
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
