import ViewContainer from "Components/Containers/ViewContainer/ViewContainer";
import useClassNames from "Hooks/useClassNames";

import type { View } from "DataTypes/Components";
import { ViewRoutes } from "DataTypes/Routes";

interface ViewProps extends View {
  path: ViewRoutes
}

function View({ className, ContextMenu, HelpPopup, widthConstrained, path, changeTitleCallback }: ViewProps) {
  const classNames = useClassNames("ViewContainer", className);

  const page = () => {
    switch (path) {
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

export default View;
